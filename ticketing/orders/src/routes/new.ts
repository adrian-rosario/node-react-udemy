import express, { Request, Response } from "express";
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuthentication,
  validateRequest,
} from "@agrtickets/common";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Ticket } from "../models/model-ticket";
import { Order } from "../models/model-order";
import { PublisherOrderCreated } from "../events/publishers/publisher-order-created";
import { natsWrapper } from "../nats/nats-wrapper";

// new order router
const router = express.Router();

const EXPIRATION_SECONDS = 15 * 60; // TODO: move to env var

router.post(
  "/api/orders",
  requireAuthentication,
  [
    body("ticketId")
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // validate valid mongo id#
      .withMessage("valid ticketId please"),
  ],
  validateRequest,
  async (theRequest: Request, theResponse: Response) => {
    //
    // find ticket
    const { ticketId } = theRequest.body;
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    //
    // make sure fetched ticket is not reserved - has been associated w/ order, find !cancelled
    // ticket model updated to have promise/method of isReserved
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError("Sorry, this ticket has been reserved.");
    }

    //
    // calculate expiration date for order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_SECONDS);

    //
    // build order, save
    const order = Order.build({
      userId: theRequest.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    // event, publish new order created, natsWrapper
    new PublisherOrderCreated(natsWrapper.client).publish({
      id: order.id,
      userId: order.userId,
      expiresAt: order.expiresAt.toISOString(),
      status: order.status,
      ticket: {
        id: ticket.id,
        price: ticket.price,
      },
    });

    theResponse.status(201).send(order);
  }
);

export { router as newOrderRouter };

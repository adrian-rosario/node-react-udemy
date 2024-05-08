import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/model-ticket";
import {
  validateRequest,
  NotFoundError,
  requireAuthentication,
  UnauthorizedError,
  BadRequestError,
} from "@agrtickets/common";
import { PublisherTicketUpdated } from "../events/publishers/publisher-ticket-updated";
import { natsWrapper } from "../nats/nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  requireAuthentication,
  [
    body("title").not().isEmpty().withMessage("Title is requred"),
    body("price")
      .isFloat({ gt: 0 })
      .not()
      .isEmpty()
      .withMessage("Price is required"),
  ],
  validateRequest,
  async (theRequest: Request, theResponse: Response) => {
    const ticket = await Ticket.findById(theRequest.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== theRequest.currentUser!.id) {
      throw new UnauthorizedError();
    }

    if (ticket.orderId) {
      throw new BadRequestError("bad request, reserved");
    }

    // apply update
    ticket.set({
      title: theRequest.body.title,
      price: theRequest.body.price,
    });
    await ticket.save();

    new PublisherTicketUpdated(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
    });

    theResponse.send(ticket);
  }
);

export { router as updateTicketRouter };

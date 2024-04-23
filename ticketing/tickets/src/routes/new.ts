import express, { Request, Response } from "express";
import { requireAuthentication, validateRequest } from "@agrtickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/model-ticket";
import { PublisherTicketCreated } from "../events/publishers/publisher-ticket-created";
import { natsWrapper } from "../nats/nats-wrapper";

const router = express.Router();

router.post(
  "/api/tickets",
  [requireAuthentication],
  [body("title").not().isEmpty().withMessage("Title is required")],
  body("price")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than zero"),

  validateRequest,
  async (theRequest: Request, theResponse: Response) => {
    const { title, price } = theRequest.body;
    const ticket = Ticket.build({
      title,
      price,
      userId: theRequest.currentUser!.id,
    });

    await ticket.save();
    await new PublisherTicketCreated(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
    });

    theResponse.status(201).send(ticket);
  }
);

export { router as createTicketRouter };

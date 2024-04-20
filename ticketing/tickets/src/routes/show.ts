import express, { Request, Response } from "express";
import { Ticket } from "../models/model-ticket";
import { NotFoundError } from "@agrtickets/common";

const router = express.Router();

router.get(
  "/api/tickets/:id",
  async (theRequest: Request, theResponse: Response) => {
    const ticket = await Ticket.findById(theRequest.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }
    theResponse.send(ticket);
  }
);

export { router as showTicketRouter };

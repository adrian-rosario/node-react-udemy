import express, { Request, Response } from "express";
import { requireAuthentication, validateRequest } from "@agrtickets/common";
import { body } from "express-validator";
import { Ticket } from "../models/model-ticket";

const router = express.Router();

router.get(
  "/api/tickets",
  async (theRequest: Request, theResponse: Response) => {
    const tickets = await Ticket.find({}); // give all tickets

    theResponse.send(tickets);
  }
);

export { router as indexTicketRouter };

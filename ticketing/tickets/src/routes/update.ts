import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/model-ticket";
import {
  validateRequest,
  NotFoundError,
  requireAuthentication,
  UnauthorizedError,
} from "@agrtickets/common";

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
  async (theRequest: Request, theResponse: Response) => {
    const ticket = await Ticket.findById(theRequest.params.id);
    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== theRequest.currentUser!.id) {
      throw new UnauthorizedError();
    }

    // apply update
    ticket.set({
      title: theRequest.body.title,
      price: theRequest.body.price,
    });
    await ticket.save();

    theResponse.send(ticket);
  }
);

export { router as updateRouter };
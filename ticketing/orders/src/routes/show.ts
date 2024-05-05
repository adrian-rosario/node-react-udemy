import express, { Request, Response } from "express";
import {
  NotFoundError,
  UnauthorizedError,
  requireAuthentication,
} from "@agrtickets/common";
import { Order } from "../models/model-order";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  requireAuthentication,
  async (theRequest: Request, theResponse: Response) => {
    // TODO: check ID used is valid
    const order = await Order.findById(theRequest.params.orderId).populate(
      "ticket"
    );

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== theRequest.currentUser!.id) {
      throw new UnauthorizedError();
    }
    theResponse.send(order);
  }
);

export { router as showOrderRouter };

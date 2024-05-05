import express, { Request, Response } from "express";
import {
  NotFoundError,
  UnauthorizedError,
  requireAuthentication,
} from "@agrtickets/common";
import { Order, OrderStatus } from "../models/model-order";

const router = express.Router();

// not acutually a delete since it's really updating
// the status flag
router.delete(
  "/api/orders/:orderId",
  requireAuthentication,
  async (theRequest: Request, theResponse: Response) => {
    const { orderId } = theRequest.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== theRequest.currentUser!.id) {
      throw new UnauthorizedError();
    }

    order.status = OrderStatus.Canceled;
    await order.save();

    // publish canceled event

    // 204, actually cancelling, not deleting
    theResponse.status(204).send(order);
  }
);

export { router as deleteOrderRouter };

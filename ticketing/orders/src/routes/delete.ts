import express, { Request, Response } from "express";
import {
  NotFoundError,
  UnauthorizedError,
  requireAuthentication,
} from "@agrtickets/common";
import { Order, OrderStatus } from "../models/model-order";
import { PublisherOrderCancelled } from "../events/publishers/publisher-order-cancelled";
import { natsWrapper } from "../nats/nats-wrapper";

const router = express.Router();

// not acutually a delete since it's really updating
// the status flag
router.delete(
  "/api/orders/:orderId",
  requireAuthentication,
  async (theRequest: Request, theResponse: Response) => {
    const { orderId } = theRequest.params;

    const order = await Order.findById(orderId).populate("ticket");

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== theRequest.currentUser!.id) {
      throw new UnauthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // publish cancelled event
    new PublisherOrderCancelled(natsWrapper.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });

    // 204, actually cancelling, not deleting
    theResponse.status(204).send(order);
  }
);

export { router as deleteOrderRouter };

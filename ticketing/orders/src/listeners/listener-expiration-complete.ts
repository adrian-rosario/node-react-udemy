import {
  Listener,
  Subjects,
  OrderExpiredInterface,
  OrderStatus,
  Publisher,
} from "@agrtickets/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "../constants";
import { Order } from "../models/model-order";
import { PublisherOrderCancelled } from "../events/publishers/publisher-order-cancelled";

export class ListenerExpirationComplete extends Listener<OrderExpiredInterface> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: OrderExpiredInterface["data"], msg: Message) {
    //
    const order = await Order.findById(data.orderId).populate("ticket");

    if (!order) {
      throw new Error("order not found");
    }

    // TODO: revisit after payments service implemented
    order.set({ status: OrderStatus.Cancelled });

    await order.save();

    await new PublisherOrderCancelled(this.client).publish({
      id: order.id,
      ticket: {
        id: order.ticket.id,
      },
      version: order.version,
    });

    msg.ack();
  }
}

import {
  Listener,
  Subjects,
  OrderCreatedInterface,
  OrderCancelledInterface,
  OrderStatus,
} from "@agrtickets/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "../../constants";
import { Order } from "../../models/model-order";

export class ListenerOrderCancelled extends Listener<OrderCancelledInterface> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCancelledInterface["data"], msg: Message) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error("order not found");
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    msg.ack();
  }
}

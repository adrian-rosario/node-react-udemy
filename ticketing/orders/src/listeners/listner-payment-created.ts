import {
  Subjects,
  Listener,
  PaymentCreatedInterface,
  OrderStatus,
} from "@agrtickets/common";
import { QUEUE_GROUP_NAME } from "../constants";
import { Message } from "node-nats-streaming";
import { Order } from "../models/model-order";

export class ListenerPaymentCreated extends Listener<PaymentCreatedInterface> {
  //
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = QUEUE_GROUP_NAME;
  //
  async onMessage(data: PaymentCreatedInterface["data"], msg: Message) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error("order not found");
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Complete,
    });

    await order.save();

    msg.ack();
  }
}

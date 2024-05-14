import { Listener, Subjects, OrderCreatedInterface } from "@agrtickets/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "../../constants";
import { Order } from "../../models/model-order";

export class ListenerOrderCreated extends Listener<OrderCreatedInterface> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: OrderCreatedInterface["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });

    await order.save();

    msg.ack();
  }
}

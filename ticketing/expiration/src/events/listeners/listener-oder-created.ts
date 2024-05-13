import {
  Listener,
  OrderCreatedInterface,
  OrderStatus,
  Subjects,
} from "@agrtickets/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "../../constants";
import { expirationQueue } from "../../queues/queue-expiration";

export class OrderCreatedListener extends Listener<OrderCreatedInterface> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;
  //
  async onMessage(data: OrderCreatedInterface["data"], msg: Message) {
    const delay =
      new Date(data.expiresAt).getTime() /* time from data */ -
      new Date().getTime(); // current time
    console.log("delay in processing latest job: ", delay);
    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}

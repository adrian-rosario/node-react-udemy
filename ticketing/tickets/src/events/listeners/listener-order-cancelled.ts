import {
  Listener,
  OrderCancelledInterface,
  Subjects,
} from "@agrtickets/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "../../constants";
import { Ticket } from "../../models/model-ticket";
import { PublisherTicketUpdated } from "../publishers/publisher-ticket-updated";

// Example of a listener which publishes its own events
export class ListenerOrderCancelled extends Listener<OrderCancelledInterface> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: OrderCancelledInterface["data"], message: Message) {
    // find ticket for order
    // throw error if no ticket
    // mark ticket as cancelled, set orderId
    // save ticket
    // ackt()
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("ticket not found");
    }

    ticket.set({ orderId: undefined });

    await ticket.save();
    new PublisherTicketUpdated(this.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId,
    });

    message.ack();
  }
}

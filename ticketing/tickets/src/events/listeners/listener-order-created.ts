import { Listener, OrderCreatedInterface, Subjects } from "@agrtickets/common";
import { Message } from "node-nats-streaming";
import { QUEUE_GROUP_NAME } from "../../constants";
import { Ticket } from "../../models/model-ticket";
import { PublisherTicketCreated } from "../publishers/publisher-ticket-created";

// Example of a listener which publishes its own events
export class ListenerOrderCreated extends Listener<OrderCreatedInterface> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = QUEUE_GROUP_NAME;
  async onMessage(data: OrderCreatedInterface["data"], message: Message) {
    // find ticket for order
    // throw error if no ticket
    // mark ticket as reserved, set orderId
    // save ticket
    // ackt()
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error("ticket not found");
    }

    ticket.set({ orderId: data.id });

    await ticket.save();
    new PublisherTicketCreated(this.client).publish({
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

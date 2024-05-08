import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TicketCreatedEventInterface,
} from "@agrtickets/common";
import { Ticket } from "../models/model-ticket";
import { QUEUE_GROUP_NAME } from "../constants";

export class ListenerTicketCreated extends Listener<TicketCreatedEventInterface> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  queueGroupName = QUEUE_GROUP_NAME; // the service we want processing this event (pods)

  // data value, for type checking, reference that interface, we want the data property
  // message value, an obj coming from the nats streaming library, has a method of ack()
  // for when we have successfully processed our message
  async onMessage(data: TicketCreatedEventInterface["data"], msg: Message) {
    // values to persist
    const { title, price, id } = data;
    const ticket = Ticket.build({
      title,
      price,
      id,
    });
    await ticket.save();
    msg.ack();
  }
}

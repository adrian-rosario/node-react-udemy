import { Message } from "node-nats-streaming";
import {
  Subjects,
  Listener,
  TicketUpdatedEventInterface,
  // NotFoundError,
} from "@agrtickets/common";
import { Ticket } from "../models/model-ticket";
import { QUEUE_GROUP_NAME } from "../constants";

export class ListenerTicketUpdated extends Listener<TicketUpdatedEventInterface> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = QUEUE_GROUP_NAME;

  async onMessage(data: TicketUpdatedEventInterface["data"], msg: Message) {
    //
    const ticket = await Ticket.findEvent(data);
    /* ** moved to ticket model
    const ticket = await Ticket.findOne({
      _id: data.id,
      version: data.version - 1,
    });
    */
    // await Ticket.findById(data.id);

    if (!ticket) {
      throw new Error("not found"); // NotFoundError();
    }

    const { title, price } = data;
    ticket.set({
      title,
      price,
    });
    await ticket.save();
    msg.ack();
  }
}

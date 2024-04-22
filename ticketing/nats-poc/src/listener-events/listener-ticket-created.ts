import { Message } from "node-nats-streaming";
import { Listener } from "./listner-root";
import { Subjects } from "../enums/enum-subjects";
import { TicketCreatedEventInterface } from "../interfaces/enum-ticket-created";

export class TicketCreatedListener extends Listener<TicketCreatedEventInterface> {
  /* in Java, here we would mark this: final */
  readonly subject: Subjects.TicketCreated = Subjects.TicketCreated; // "ticket:created";
  queueGroupName = "payments-service";
  onMessage(data: TicketCreatedEventInterface["data"], msg: Message): void {
    console.log("event data\n", data);

    msg.ack();
    // throw new Error("Method not implemented.");
  }
}

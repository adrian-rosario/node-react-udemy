import { Message } from "node-nats-streaming";
import { Listener } from "./listner-root";

export class TicketCreatedListener extends Listener {
  subject = "ticket:created";
  queueGroupName = "payments-service";
  onMessage(data: any, msg: Message): void {
    console.log("event data\n", data);

    msg.ack();
    // throw new Error("Method not implemented.");
  }
}

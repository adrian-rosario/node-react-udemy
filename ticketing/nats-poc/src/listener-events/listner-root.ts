import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "../enums/enum-subjects";

interface Event {
  subject: Subjects;
  data: any;
}

// generic class:
// <T extends Event>
// whenever we try and make user of Listener in any way
// we're going to have to provide some custom type to
// this
// - can be thought of as an argument, for types
export abstract class Listener<T extends Event> {
  abstract subject: T["subject"]; // string;
  abstract queueGroupName: string;
  private client: Stan;
  protected ackWait = 5 * 1000; // subclass can definte
  abstract onMessage(data: T["data"], msg: Message): void; // (data: any, msg: Message)

  constructor(client: Stan) {
    this.client = client;
  }

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(
        `\nMessage received: ${this.subject} - ${this.queueGroupName}`
      );
      const parsedData = this.parseMessage(msg);
      this.onMessage(parsedData, msg);
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();

    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf-8"));
  }
}

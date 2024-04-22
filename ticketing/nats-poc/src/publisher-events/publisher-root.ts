import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "../enums/enum-subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Publisher<T extends Event> {
  private client: Stan;

  abstract subject: T["subject"];
  constructor(natsClient: Stan) {
    this.client = natsClient;
  }

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (error) => {
        if (error) {
          return reject(error);
        }
        console.log("Publisher Event published.\n", this.subject);
        resolve();
      });
    });
  }
}

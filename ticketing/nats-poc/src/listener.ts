import nats, { Message, Stan } from "node-nats-streaming";
import { randomBytes } from "crypto";
import { TicketCreatedListener } from "./listener-events/listener-ticket-created";

console.clear();

const instanceId = randomBytes(4).toString("hex");

const stan = nats.connect("ticketing", instanceId, {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("listener connected to nats, id: ", instanceId);

  stan.on("close", () => {
    console.log("NATS connection closed");
    process.exit();
  });

  new TicketCreatedListener(stan).listen();

  // enable acknowlegement / response option
  // after ie. 30 seconds of no acknowlegement, another
  // subscribed instance / queue group will be notified
  // of the event
  /*
  const stanCustomOptions = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    // make user our services don't miss out on an event
    .setDurableName("accounting-service");
  */

  /*
  const subscription = stan.subscribe(
    "ticket:created",
    // - second argument: Queue Group
    // need to be assigned to queue group, so only one instance
    // of our listeners will respond to an incoming event

    // makes sure, if we disconnect, all clients/subscriptions
    // with this durable name it will not dump the entire subscription
    "QueueGroup-OrdersService",
    stanCustomOptions
  );
  */

  // 'message' = an 'event'
  /*
  subscription.on("message", (theMessageData: Message) => {
    const data = theMessageData.getData();

    if (typeof data === "string") {
      console.log(
        `\nEvent sequence number: ${theMessageData.getSequence()} \nMessage data:${theMessageData.getData()}`
      );
    }

    // acknowlege, or else another queue group
    // instance will be notified (in the case
    // of error during fulfillment)
    theMessageData.ack();
  });
  */
});

process.on("SIGINT", () => {
  stan.close();
});
process.on("SIGTERM", () => {
  stan.close();
});

import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./publisher-events/publisher-ticket-created";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("publisher connected to nats");

  const publisher = new TicketCreatedPublisher(stan);

  try {
    await publisher.publish({
      id: "321",
      title: "Contact",
      price: 350,
    });
  } catch (e) {
    console.log(e);
  }
});

/*
console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("publisher connected to nats");

  const dataToShare = JSON.stringify({
    id: "123",
    title: "slayer",
    price: 19.89,
  });

  stan.publish("ticket:created", dataToShare, () => {
    console.log("== PUBLISHER event\n", dataToShare);
  });
});
*/

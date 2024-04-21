import nats from "node-nats-streaming";

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

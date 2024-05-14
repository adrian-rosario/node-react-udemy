import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats/nats-wrapper";
import { ListenerOrderCreated } from "./events/listeners/listener-order-created";
import { ListenerOrderCancelled } from "./events/listeners/listener-order-cancelled";

// mongodb
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not defined.");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  // nats checks
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error("NATS_CLIENT_ID must be defined");
  }
  if (!process.env.NATS_URL) {
    throw new Error("NATS_URL must be defined");
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error("NATS_CLUSTER_ID must be defined");
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );

    natsWrapper.client.on("close", () => {
      console.log("nats singleton connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

    new ListenerOrderCreated(natsWrapper.client).listen();
    new ListenerOrderCancelled(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);

    console.log("Tickets MongoDB connected.");
    //
  } catch (theError) {
    console.error(theError);
  }

  app.listen(3000, () => {
    console.log("Tickets application, listening on port: 3000");
  });
};

start();

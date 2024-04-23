import mongoose from "mongoose";
import { app } from "./app";
import { natsWrapper } from "./nats/nats-wrapper";
import { randomBytes } from "crypto";

// mongodb
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not defined.");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    const instanceId = randomBytes(4).toString("hex");
    await natsWrapper.connect(
      "ticketing",
      instanceId,
      "http://nats-cluster-ip-service:4222"
    );

    natsWrapper.client.on("close", () => {
      console.log("nats singleton connection closed");
      process.exit();
    });

    process.on("SIGINT", () => natsWrapper.client.close());
    process.on("SIGTERM", () => natsWrapper.client.close());

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

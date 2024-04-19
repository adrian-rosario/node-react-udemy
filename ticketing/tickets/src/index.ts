import mongoose from "mongoose";
import { app } from "./app";

// mongodb
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not defined.");
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
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

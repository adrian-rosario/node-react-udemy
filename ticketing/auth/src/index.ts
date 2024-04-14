import mongoose from "mongoose";
import { app } from "./app";

// mongodb
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not defined.");
  }

  try {
    await mongoose.connect(
      "mongodb://auth-mongodb-cluster-ip-service:27017/auth"
    );

    console.log("MongoDB connected.");
    //
  } catch (theError) {
    console.error(theError);
  }

  app.listen(3000, () => {
    console.log("Auth application, listening on port: 3000");
  });
};

start();

import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import {
  errorHandler,
  NotFoundError,
  currentUserCheck,
} from "@agrtickets/common";
import cookieSession from "cookie-session";
import { createChargerRouter } from "./routes/new-charge";

const app = express();

app.set("trust proxy", true); // so express is aware there is an ingress proxy

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // https connection: false if we are in a test env, otherwise true
  })
);
app.use(currentUserCheck);

app.use(createChargerRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError(); // for 404 / path not found
});
app.use(errorHandler);

export { app };

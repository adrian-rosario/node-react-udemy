import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { errorHandler } from "@agrtickets/common";
import { NotFoundError } from "@agrtickets/common";
import cookieSession from "cookie-session";
import { createTicketRouter } from "./routes/new";
import { currentUserCheck } from "@agrtickets/common";
import { showTicketRouter } from "./routes/show";
import { indexTicketRouter } from "./routes/index";
import { updateRouter } from "./routes/update";

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

app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexTicketRouter);
app.use(updateRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError(); // for 404 / path not found
});
app.use(errorHandler);

export { app };

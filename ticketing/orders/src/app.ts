import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { errorHandler } from "@agrtickets/common";
import { NotFoundError } from "@agrtickets/common";
import cookieSession from "cookie-session";

import { indexOrderRouter } from "./routes";
import { newOrderRouter } from "./routes/new";
import { showOrderRouter } from "./routes/show";
import { deleteOrderRouter } from "./routes/delete";

const app = express();

app.set("trust proxy", true); // so express is aware there is an ingress proxy

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test", // https connection: false if we are in a test env, otherwise true
  })
);

app.use(newOrderRouter);
app.use(showOrderRouter);
app.use(deleteOrderRouter);
app.use(indexOrderRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError(); // for 404 / path not found
});
app.use(errorHandler);

export { app };

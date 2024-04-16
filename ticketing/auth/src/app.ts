import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/sign-in";
import { signOutRouter } from "./routes/sign-out";
import { signUpRouter } from "./routes/sign-up";
import { errorHandler } from "./middleware/error-handling";
import { NotFoundError } from "./middleware/errors/error-not-found";
import cookieSession from "cookie-session";

const app = express();

app.set("trust proxy", true); // so express is aware there is an ingress proxy

app.use(json());

app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", async (theRequest, theResponse, nextAction) => {
  throw new NotFoundError(); // for 404 / path not found
});
app.use(errorHandler);

export { app };

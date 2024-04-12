import express from "express";
import "express-async-errors";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/sign-in";
import { signOutRouter } from "./routes/sign-out";
import { signUpRouter } from "./routes/sign-up";
import { errorHandler } from "./middleware/error-handling";
import { NotFoundError } from "./middleware/errors/error-not-found";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.all("*", async (theRequest, theResponse, nextAction) => {
  throw new NotFoundError(); // for 404 / page not found
});
app.use(errorHandler);

app.listen(3000, () => {
  console.log("Auth application, listening on port: 3000");
});

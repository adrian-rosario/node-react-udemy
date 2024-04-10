import express from "express";
import { json } from "body-parser";
import { currentUserRouter } from "./routes/current-user";
import { signInRouter } from "./routes/sign-in";
import { signOutRouter } from "./routes/sign-out";
import { signUpRouter } from "./routes/sign-up";

const app = express();
app.use(json());

app.use(currentUserRouter);
// app.get("/api/users/currentuser", (req, res) => {
//   res.send("so far so good, omg");
// });
app.use(signInRouter);
app.use(signOutRouter);
app.use(signUpRouter);

app.listen(3000, () => {
  console.log("Auth application, listening on port: 3000");
});

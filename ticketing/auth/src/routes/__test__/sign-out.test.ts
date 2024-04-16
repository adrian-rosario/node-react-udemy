import request from "supertest";
import { app } from "../../app";

it("succeeds with sign out", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "me@me.com",
      password: "pwd4",
    })
    .expect(201);

  await request(app).post("/api/users/signout").expect(200);
});

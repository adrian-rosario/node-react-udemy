import request from "supertest";
import { app } from "../../app";

it("returns 201 on signup success", async () => {
  return request(app)
    .post("/api/users/signup")
    .send({
      email: "me@me.com",
      password: "pwd4",
    })
    .expect(201);
});

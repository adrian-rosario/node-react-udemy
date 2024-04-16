import request from "supertest";
import { app } from "../../app";

it("returns error if account does not exist", async () => {
  return request(app)
    .post("/api/users/signin")
    .send({
      email: "me@me.com",
      password: "pwd4",
    })
    .expect(400);
});

it("fails for incorrect password", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "me@me.com",
      password: "pwd4",
    })
    .expect(201);

  await request(app).post("/api/users/signout").expect(200);

  await request(app)
    .post("/api/users/signin")
    .send({
      email: "me.com",
      password: "pwd4",
    })
    .expect(400);
});

it("succeeds with correct credentials", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "me@me.com",
      password: "pwd4",
    })
    .expect(201);

  await request(app).post("/api/users/signout").expect(200);

  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "me@me.com",
      password: "pwd4",
    })
    .expect(200);

  expect(response.get("Set-Cookie")).toBeDefined();
});

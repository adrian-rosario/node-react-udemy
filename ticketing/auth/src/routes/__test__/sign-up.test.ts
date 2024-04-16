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

it("returns 400 with invalid fields", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "memecom",
      password: "pwd777",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "me@me.com",
      password: "pwd",
    })
    .expect(400);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "",
      password: "",
    })
    .expect(400);
});

it("returns 400, duplicate email error", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "me@me.com",
      password: "pwd4",
    })
    .expect(201);

  await request(app)
    .post("/api/users/signup")
    .send({
      email: "me@me.com",
      password: "pwd4",
    })
    .expect(400);
});

it("has a defined cookie when signup is successful", async () => {
  const response = await request(app)
    .post("/api/users/signup")
    .send({
      email: "me@me.com",
      password: "pwd4",
    })
    .expect(201);

  expect(response.get("Set-Cookie")).toBeDefined();
});

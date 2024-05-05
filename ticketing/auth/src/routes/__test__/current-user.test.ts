import request from "supertest";
import { app } from "../../app";

it("succeeds with current user details", async () => {
  // const signUpResponse = await request(app)
  //   .post("/api/users/signup")
  //   .send({
  //     email: "me@me.com",
  //     password: "pwd4",
  //   })
  //   .expect(201);

  // const cookie = signUpResponse.get("Set-Cookie");

  const cookie = await global.signin();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie) // spec is now an obj, =\
    .send()
    .expect(200);

  console.log(`response body ${JSON.stringify(response.body)}`);
  expect(response.body.currentUser.email).toEqual("me@me.com");
});

it("responds with null if unauthenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});

import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns 404 if a ticket isn't found", async () => {
  const generatedId = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${generatedId}`).send().expect(404);
});

it("returns 201 if a ticket is found", async () => {
  const title = "Aquabats";
  const price = 10;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});

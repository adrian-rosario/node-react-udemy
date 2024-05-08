import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/model-ticket";
import mongoose from "mongoose";

it("fetches an order", async () => {
  // 1. create ticket
  const ticketOne = Ticket.build({
    title: "ticket one for test",
    price: 10,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  ticketOne.save();

  const userOne = global.signin();

  // 2. request to build and order w/ ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // 3. order fetch request
  const { body: fetchOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userOne)
    .expect(200);
  expect(fetchOrder.id).toEqual(order.id);
});

// TODO: 401 unauthorized
it("returns an unauthorized error", async () => {
  // 1. create ticket
  const ticketOne = Ticket.build({
    title: "ticket two for test",
    price: 20,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  ticketOne.save();

  const userOne = global.signin();
  const userTwo = global.signin();

  // 2. request to build and order w/ ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // 3. order fetch request
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", userTwo)
    .expect(401);
});

// TODO: 404 not found

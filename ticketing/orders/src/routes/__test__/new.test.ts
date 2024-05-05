import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Ticket } from "../../models/model-ticket";
import { Order, OrderStatus } from "../../models/model-order";

it("returns a 404 error, ticket does not exist", async () => {
  // generate a valid id
  const ticketId = new mongoose.Types.ObjectId();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({
      ticketId,
    })
    .expect(404);
});

it("returns a 400 error, ticket is already reserved", async () => {
  // create a ticket, add to db
  const ticket = Ticket.build({
    title: "new ticket for test",
    price: 10,
  });

  await ticket.save();

  // create an order, add to db
  const order = Order.build({
    userId: "abc123",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket,
  });

  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("returns success, ticket successfully reserved", async () => {
  // create a ticket, add to db
  const ticket = Ticket.build({
    title: "another new ticket for test",
    price: 20,
  });

  await ticket.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin())
    .send({ ticketId: ticket.id })
    .expect(201);
});

// TODO: order created event
it.todo("order created emitted");

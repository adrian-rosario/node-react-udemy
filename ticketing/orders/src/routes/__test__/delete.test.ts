import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/model-ticket";
import { Order, OrderStatus } from "../../models/model-order";
import { natsWrapper } from "../../nats/nats-wrapper";

it("returns a 204, order deleted/cancelled", async () => {
  // 1. create ticket
  const ticketOne = Ticket.build({
    title: "ticket one for test",
    price: 10,
  });
  ticketOne.save();

  const userOne = global.signin();

  // 2. request to build and order w/ ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // 3. cancel order
  await request(app)
    .delete(`/api/orders/${order.id}`)
    .set("Cookie", userOne)
    .send()
    .expect(204);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

// order cancelled event
it("camcells an order", async () => {
  // 1. create ticket
  const ticketOne = Ticket.build({
    title: "ticket one for test",
    price: 10,
  });
  ticketOne.save();

  const userOne = global.signin();

  // 2. request to build and order w/ ticket
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

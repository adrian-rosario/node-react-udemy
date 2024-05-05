import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/model-ticket";

it("fetches users order", async () => {
  const ticketOne = Ticket.build({
    title: "ticket one for test",
    price: 10,
  });
  ticketOne.save();

  const ticketTwo = Ticket.build({
    title: "ticket two for test",
    price: 20,
  });
  ticketTwo.save();

  const ticketThree = Ticket.build({
    title: "ticket three for test",
    price: 30,
  });
  ticketThree.save();

  const userOne = global.signin();
  const userTwo = global.signin();

  // user 1 order, one order
  await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({ ticketId: ticketOne.id })
    .expect(201);

  // user 2 order, two orders
  const { body: userTwoOrderOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketTwo.id })
    .expect(201);

  const { body: userTwoOrderTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({ ticketId: ticketThree.id })
    .expect(201);

  // user 2 orders request
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", userTwo)
    .expect(200);

  // expect(response.status).toBe(200);
  // assert user two's orders
  expect(response.body.length).toEqual(2);
  expect(response.body[0].id).toEqual(userTwoOrderOne.id);
  expect(response.body[1].id).toEqual(userTwoOrderTwo.id);
  expect(response.body[0].ticket.id).toEqual(ticketTwo.id);
  expect(response.body[1].ticket.id).toEqual(ticketThree.id);
});

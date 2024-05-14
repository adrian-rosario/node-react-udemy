import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { Order } from "../../models/model-order";
import { OrderStatus } from "@agrtickets/common";
import { stripe } from "../../stripe";
import { Payment } from "../../models/model-payments";
// import { stripe } from "../../stripe";

// jest.mock("../../stripe.ts");

it("returns 404 if order doesn't exist", async () => {
  await request(app) //
    .post("/api/payments") //
    .set("Cookie", global.signin())
    .send({
      token: "asdf",
      orderId: new mongoose.Types.ObjectId().toHexString(),
    });

  expect(404);
});

it("returns 401 if order doesn't belong to user", async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    price: 500,
  });

  await order.save();

  await request(app) //
    .post("/api/payments") //
    .set("Cookie", global.signin())
    .send({
      token: "asdf",
      orderId: order.id,
    });
  expect(401);
});

it("returns a 400 if order is cancelled", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    status: OrderStatus.Cancelled,
    price: 500,
  });
  await order.save();

  await request(app) //
    .post("/api/payments") //
    .set("Cookie", global.signin(userId))
    .send({
      orderId: order.id,
      token: "abc",
    });

  expect(400);
});

it("returns a 204 with valid details", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const randomPrice = Math.floor(Math.random() * 100000);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    version: 0,
    status: OrderStatus.Created,
    price: randomPrice, // 500,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      orderId: order.id,
    });
  expect(201);

  const charges = await stripe.charges.list({ limit: 50 });
  const charge = charges.data.find((charge) => {
    return charge.amount === randomPrice * 100;
  });
  expect(charge).toBeDefined();
  expect(charge?.currency).toEqual("usd");

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: charge!.id,
  });
  expect(payment).not.toBeNull();

  /*
  // tests using Stripe mock
  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

  expect(chargeOptions.source).toEqual("tok_visa");
  expect(chargeOptions.amount).toEqual(500 * 100);
  expect(chargeOptions.currency).toEqual("usd");
  */
});

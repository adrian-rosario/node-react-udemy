import { OrderCreatedInterface, OrderStatus } from "@agrtickets/common";
import { natsWrapper } from "../../../nats/nats-wrapper";
import { ListenerOrderCreated } from "../listener-order-created";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/model-order";

const setup = async () => {
  const listener = new ListenerOrderCreated(natsWrapper.client);

  const data: OrderCreatedInterface["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: "abc",
    userId: "cba",
    status: OrderStatus.Created,
    ticket: {
      id: "abc",
      price: 20,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("replicates order details", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id);
  expect(order!.price).toEqual(data.ticket.price);
});

it("acknowleges the message", async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

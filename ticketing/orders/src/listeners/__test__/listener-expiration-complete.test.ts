import mongoose from "mongoose";
import { Order } from "../../models/model-order";
import { Ticket } from "../../models/model-ticket";
import { natsWrapper } from "../../nats/nats-wrapper";
import { ListenerExpirationComplete } from "../listener-expiration-complete";
import { OrderExpiredInterface, OrderStatus } from "@agrtickets/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  const listener = new ListenerExpirationComplete(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "show",
    price: 10,
  });

  await ticket.save();

  const order = Order.build({
    userId: "abc123",
    status: OrderStatus.Created,
    expiresAt: new Date(),
    ticket: ticket.id,
  });

  await order.save();

  const data: OrderExpiredInterface["data"] = {
    orderId: order.id,
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, order, ticket, data, msg };
};

it("updates order status to cancelled", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Canceled);
});

it("emits order cancelled event", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(natsWrapper.client.publish).toHaveBeenCalled();

  const eventData = JSON.parse(
    (natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
  );

  expect(eventData.id).toEqual(order.id);
});

it("acknowleges the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

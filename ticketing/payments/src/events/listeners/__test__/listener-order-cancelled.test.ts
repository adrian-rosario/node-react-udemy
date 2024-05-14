import { OrderCancelledInterface, OrderStatus } from "@agrtickets/common";
import { natsWrapper } from "../../../nats/nats-wrapper";
import { ListenerOrderCancelled } from "../listener-order-cancelled";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Order } from "../../../models/model-order";

const setup = async () => {
  const listener = new ListenerOrderCancelled(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    userId: "cba",
    price: 50,
  });
  await order.save();

  const orderCancelled = (ListenerOrderCancelled["data"] = {
    id: order.id,
    version: 1,
    ticket: {
      id: "abc",
    },
  });

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };
  return { listener, orderCancelled, msg, order };
};

it("updates order status", async () => {
  const { listener, orderCancelled, msg, order } = await setup();
  await listener.onMessage(orderCancelled, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("acknowleges the message", async () => {
  const { listener, orderCancelled, msg, order } = await setup();
  await listener.onMessage(orderCancelled, msg);

  expect(msg.ack).toHaveBeenCalled();
});

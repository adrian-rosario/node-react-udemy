import { ListenerOrderCancelled } from "../listener-order-cancelled";
import { natsWrapper } from "../../../nats/nats-wrapper";
import { Ticket } from "../../../models/model-ticket";
import { OrderCancelledInterface, OrderStatus } from "@agrtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // create listener instance
  // create/save ticket
  // build fake data object
  const listener = new ListenerOrderCancelled(natsWrapper.client);
  const orderId = new mongoose.Types.ObjectId().toHexString();
  const ticket = Ticket.build({
    title: "Sasquatch",
    price: 20,
    userId: "abc123",
  });
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledInterface["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      id: ticket.id,
    },
    version: 0,
  };

  //@ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };
  return { message, data, ticket, orderId, listener };
};

it("updates, publishes, adn acks message", async () => {
  const { message, data, ticket, orderId, listener } = await setup();

  await listener.onMessage(data, message);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();

  expect(message.ack).toHaveBeenCalled();

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});

import { ListenerOrderCreated } from "../listener-order-created";
import { natsWrapper } from "../../../nats/nats-wrapper";
import { Ticket } from "../../../models/model-ticket";
import { OrderCreatedInterface, OrderStatus } from "@agrtickets/common";
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // create listener instance
  // create/save ticket
  // build fake data object
  const listener = new ListenerOrderCreated(natsWrapper.client);
  const ticket = Ticket.build({
    title: "Sasquatch",
    price: 20,
    userId: "abc123",
  });
  await ticket.save();

  const data: OrderCreatedInterface["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: "abc123",
    expiresAt: "321asdf",
    status: OrderStatus.Created,
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
    version: 0,
  };

  //@ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };
  return { ticket, data, message, listener };
};

it("sets user id of ticket", async () => {
  const { ticket, data, message, listener } = await setup();

  await listener.onMessage(data, message);

  const ticketWithUpdate = await Ticket.findById(ticket.id);

  expect(ticketWithUpdate!.orderId).toEqual(data.id);
});

it("acknowleges the message", async () => {
  const { ticket, data, message, listener } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

it("publishes ticketCreated event", async () => {
  const { ticket, data, message, listener } = await setup();

  await listener.onMessage(data, message);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
  //@ts-ignore
  console.log("== inspecting nats:\n", natsWrapper.client.publish.mock.calls);

  const testData = (natsWrapper.client.publish as jest.Mock).mock.calls[0][1];

  const parsedTestData = JSON.parse(testData);

  console.log(parsedTestData.id);
  // console.log(parsedTestData.title);
  expect(data.id).toEqual(parsedTestData.orderId);
});

// it('', async()=>{})

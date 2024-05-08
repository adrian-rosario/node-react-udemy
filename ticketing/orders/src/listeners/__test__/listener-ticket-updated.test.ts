import { natsWrapper } from "../../nats/nats-wrapper";
import { ListenerTicketUpdated } from "../listener-ticket-updated";
import { Ticket } from "../../models/model-ticket";
import mongoose from "mongoose";
import { TicketUpdatedEventInterface } from "@agrtickets/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
  // create listener
  // create and save ticket
  // create fake data object
  // create fake message object
  // return
  const listener = new ListenerTicketUpdated(natsWrapper.client);
  const ticket = Ticket.build({
    title: "Budgie",
    price: 100,
    id: new mongoose.Types.ObjectId().toHexString(),
  });
  await ticket.save();

  const data: TicketUpdatedEventInterface["data"] = {
    id: ticket.id,
    title: "Budgie & Slayer",
    price: 500,
    userId: "abc123",
    version: ticket.version + 1,
  };

  //@ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };
  return { listener, data, message, ticket };
};

it("ticket find, update, save", async () => {
  const { listener, data, message, ticket } = await setup();

  await listener.onMessage(data, message);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acknowleges the message", async () => {
  const { listener, data, message, ticket } = await setup();

  await listener.onMessage(data, message);

  expect(message.ack).toHaveBeenCalled();
});

it("does not call ack(), version is out of sequence", async () => {
  const { message, data, listener } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, message);
  } catch (e) {}

  expect(message.ack).not.toHaveBeenCalled();
});

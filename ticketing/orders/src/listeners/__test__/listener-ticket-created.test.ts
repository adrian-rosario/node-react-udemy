import mongoose from "mongoose";
import { natsWrapper } from "../../nats/nats-wrapper";
import { ListenerTicketCreated } from "../listener-ticket-created";
import { TicketCreatedEventInterface } from "@agrtickets/common";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../models/model-ticket";

const testSetup = async () => {
  // create listener instance
  // create fake data event
  // create a fake message object
  const listener = new ListenerTicketCreated(natsWrapper.client);
  const data: TicketCreatedEventInterface["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 10,
    title: "fishbone - cbgb",
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // we don't need all the messages for the test
  //@ts-ignore
  const message: Message = {
    ack: jest.fn(),
  };
  return { listener, data, message };
};

it("creates and saves a ticket", async () => {
  const { listener, data, message } = await testSetup();
  // call onMessage with data object and message object
  // assert ticket created
  await listener.onMessage(data, message);
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});

it("acknowleges the message", async () => {
  const { listener, data, message } = await testSetup();
  // call onMessage with data object and message object
  // assert ack is called
  await listener.onMessage(data, message);
  expect(message.ack).toHaveBeenCalled();
});

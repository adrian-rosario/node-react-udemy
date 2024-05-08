import { Ticket } from "../model-ticket";

it("tests currency control", async () => {
  // create ticket
  // save to db
  // fetch ticket twice
  // make two separate changes to the tickets
  // save first fetch ticket
  // save second fetched ticket (wil have outdated version number), expect error

  const ticket = Ticket.build({
    title: "abc123",
    price: 10,
    userId: "321abc",
  });
  await ticket.save();

  const firstTicket = await Ticket.findById(ticket.id);
  const secondTicket = await Ticket.findById(ticket.id);

  firstTicket!.set({ price: 100 });
  secondTicket!.set({ price: 70 });

  try {
    await firstTicket!.save();
    await secondTicket!.save();

    // expect(secondTicket).toThrow(Error);

    expect(async () => {
      await secondTicket!.save();
    }).toThrow();

    //
  } catch (err) {}
});

it("validates version munber increment", async () => {
  const ticket = Ticket.build({
    title: "abc123",
    price: 10,
    userId: "321abc",
  });
  await ticket.save();

  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});

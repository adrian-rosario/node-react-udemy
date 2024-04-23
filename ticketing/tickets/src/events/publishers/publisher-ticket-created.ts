import {
  Publisher,
  Subjects,
  TicketCreatedEventInterface,
} from "@agrtickets/common";

export class PublisherTicketCreated extends Publisher<TicketCreatedEventInterface> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

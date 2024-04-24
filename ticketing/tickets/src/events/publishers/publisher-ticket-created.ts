import {
  Publisher,
  Subjects,
  TicketCreatedEventInterface,
} from "@agrtickets/common";

export class PublisherTicketCreated extends Publisher<TicketCreatedEventInterface> {
  readonly subject = Subjects.TicketCreated;
}

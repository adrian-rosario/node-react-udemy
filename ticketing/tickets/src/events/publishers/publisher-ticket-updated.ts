import { Publisher, Subjects, TicketUpdatedEvent } from "@agrtickets/common";

export class PublisherTicketUpdated extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}

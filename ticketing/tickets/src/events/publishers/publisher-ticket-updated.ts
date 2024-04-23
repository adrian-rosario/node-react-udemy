import { Publisher, Subjects, TicketUpdatedEvent } from "@agrtickets/common";

export class PublisherTicketUpdated extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}

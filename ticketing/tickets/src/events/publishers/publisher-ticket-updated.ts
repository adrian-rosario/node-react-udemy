import {
  Publisher,
  Subjects,
  TicketUpdatedEventInterface,
} from "@agrtickets/common";

export class PublisherTicketUpdated extends Publisher<TicketUpdatedEventInterface> {
  readonly subject = Subjects.TicketUpdated;
}

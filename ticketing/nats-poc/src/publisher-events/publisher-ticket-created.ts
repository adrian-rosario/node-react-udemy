import { Publisher } from "./publisher-root";
import { Subjects } from "../enums/enum-subjects";
import { TicketCreatedEventInterface } from "../interfaces/enum-ticket-created";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEventInterface> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}

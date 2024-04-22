import { Subjects } from "../enums/enum-subjects";

export interface TicketCreatedEventInterface {
  subject: Subjects.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
  };
}

import { Subjects, Publisher, OrderExpiredInterface } from "@agrtickets/common";

export class ExpirationCompletePublisher extends Publisher<OrderExpiredInterface> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

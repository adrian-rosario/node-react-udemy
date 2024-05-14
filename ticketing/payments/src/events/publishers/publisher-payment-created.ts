import {
  Subjects,
  Publisher,
  PaymentCreatedInterface,
} from "@agrtickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedInterface> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

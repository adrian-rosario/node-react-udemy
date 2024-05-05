import {
  Publisher,
  OrderCancelledInterface,
  Subjects,
} from "@agrtickets/common";

export class PublisherOrderCancelled extends Publisher<OrderCancelledInterface> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}

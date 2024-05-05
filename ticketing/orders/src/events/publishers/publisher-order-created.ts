import { Publisher, OrderCreatedInterface, Subjects } from "@agrtickets/common";

export class PublisherOrderCreated extends Publisher<OrderCreatedInterface> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}

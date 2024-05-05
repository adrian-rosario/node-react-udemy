import mongoose from "mongoose";
import { Order, OrderStatus } from "./model-order";
// import { OrderStatus } from "@agrtickets/common";

interface TicketAttributes {
  title: string;
  price: number;
  // version: string;
}

export interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
  // version: string;
}

interface TicketModel extends mongoose.Model<TicketDocument> {
  build(attribuies: TicketAttributes): TicketDocument;
}
const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, returned) {
        returned.id = returned._id;
        delete returned._id;
      },
    },
  }
);

// statics object is how we add a new method directly to
// the ticket model itself
ticketSchema.statics.build = (attributes: TicketAttributes) => {
  return new Ticket(attributes);
};
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ],
    },
  });
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchema
);

export { Ticket };

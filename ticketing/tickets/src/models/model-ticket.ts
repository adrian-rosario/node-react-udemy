import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// for type checking of attributes when we create a new ticket
// ie. we can't accidentally mangle the propertie w/o type checks complaining
interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

// describes User document (in mongodb) properties
interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  version: number;
  orderId?: string;
  isReserved(): Promise<boolean>;
}

// describes the properties a User model has
interface TicketModel extends mongoose.Model<TicketDocument> {
  build(theAttribues: TicketAttributes): TicketDocument;
}

const ticketSchemea = new mongoose.Schema(
  {
    title: {
      type: String, // specific to Mongoose, referring to an actual constructor (hence cap)
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      requred: true,
    },
    orderId: {
      type: String,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id; // create id field, then delte _id
        delete ret._id;
      },
    },
  }
);

ticketSchemea.set("versionKey", "version");
ticketSchemea.plugin(updateIfCurrentPlugin);

ticketSchemea.statics.build = (theAttributes: TicketAttributes) => {
  return new Ticket(theAttributes);
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchemea
);

export { Ticket };

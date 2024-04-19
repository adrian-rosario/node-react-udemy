import mongoose from "mongoose";
// import { PasswordManager } from "../util/password-manager";

// for type checking of attributes when we create a new ticket
// ie. we can't accidentally mangle the propertie w/o type checks complaining
interface TicketAttributes {
  title: string;
  price: number;
  userId: string;
}

// describes the properties a User model has
interface TicketModel extends mongoose.Model<TicketDocument> {
  build(theAttribues: TicketAttributes): TicketDocument;
}

// describes User document (in mongodb) properties
interface TicketDocument extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
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

ticketSchemea.statics.build = (theAttributes: TicketAttributes) => {
  return new Ticket(theAttributes);
};

const Ticket = mongoose.model<TicketDocument, TicketModel>(
  "Ticket",
  ticketSchemea
);

export { Ticket };

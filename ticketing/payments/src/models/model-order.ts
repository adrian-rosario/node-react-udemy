import { OrderStatus } from "@agrtickets/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttributes {
  // properties we have to provide when building an order
  id: string;
  status: OrderStatus;
  version: number;
  userId: string;
  price: number;
}

interface OrderDocument extends mongoose.Document {
  // properties an order has
  // id provided by mongoose/above
  status: OrderStatus;
  version: number;
  userId: string;
  expiresAt: Date;
  price: number;
}

interface OrderModel extends mongoose.Model<OrderDocument> {
  // properties the model itself contains
  build(attribuets: OrderAttributes): OrderDocument;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

orderSchema.set("versionKey", "version"); // do not use __v
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attributes: OrderAttributes) => {
  return new Order({
    _id: attributes.id,
    version: attributes.version,
    userId: attributes.userId,
    price: attributes.price,
    status: attributes.status,
  });
};

const Order = mongoose.model<OrderDocument, OrderModel>("Order", orderSchema);

export { Order };

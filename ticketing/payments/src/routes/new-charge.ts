import express, { Request, Response } from "express";
import { body } from "express-validator";
import {
  requireAuthentication,
  validateRequest,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
  OrderStatus,
} from "@agrtickets/common";
import { Order } from "../models/model-order";
import { stripe } from "../stripe";
import { Payment } from "../models/model-payments";
import { PaymentCreatedPublisher } from "../events/publishers/publisher-payment-created";
import { natsWrapper } from "../nats/nats-wrapper";

const router = express.Router();

router.post(
  "/api/payments",
  requireAuthentication,
  [body("token").not().isEmpty(), body("orderId").not().isEmpty()],
  validateRequest,

  async (theRequest: Request, theResponse: Response) => {
    // find the order
    // make sure user own's order
    // order is not cancelled
    const { token, orderId } = theRequest.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== theRequest.currentUser!.id) {
      throw new UnauthorizedError();
    }
    if (order.status === OrderStatus.Cancelled) {
      throw new BadRequestError("cancelled order");
    }

    // take token, reach out to Stripe, and charge CC
    const charge = await stripe.charges.create({
      amount: order.price * 100,
      currency: "usd",
      source: token,
      // description: ''
    });

    const payment = Payment.build({
      orderId,
      stripeId: charge.id,
    });
    await payment.save();

    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId,
    });

    theResponse.status(201).send({ id: payment.id });
  }
);

export { router as createChargerRouter };

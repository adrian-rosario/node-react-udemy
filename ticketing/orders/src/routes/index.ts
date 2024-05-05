import express, { Request, Response } from "express";
import { requireAuthentication } from "@agrtickets/common";
import { Order } from "../models/model-order";

const router = express.Router();

router.get(
  "/api/orders",
  requireAuthentication,
  async (theRequest: Request, theResponse: Response) => {
    const orders = await Order.find({
      userId: theRequest.currentUser!.id,
    }).populate("ticket");
    theResponse.send(orders);
  }
);

export { router as indexOrderRouter };

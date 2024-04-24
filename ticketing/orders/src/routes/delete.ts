import express, { Request, Response } from "express";

const router = express.Router();

router.delete(
  "/api/orders/:orderId",
  (theReques: Request, theResponse: Response) => {
    theResponse.send({});
  }
);

export { router as deleteOrderRouter };

import express, { Request, Response } from "express";

const router = express.Router();

router.get(
  "/api/orders/:orderId",
  (theReques: Request, theResponse: Response) => {
    theResponse.send({});
  }
);

export { router as showOrderRouter };

import express, { Request, Response } from "express";

const router = express.Router();

router.post("/api/orders", (theReques: Request, theResponse: Response) => {
  theResponse.send({});
});

export { router as newOrderRouter };

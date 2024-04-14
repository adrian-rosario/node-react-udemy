import express, { Request, Response, NextFunction } from "express";
import { currentUserCheck } from "../util/current-user-check";
import { requireAuthentication } from "../util/requireAuthentication";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUserCheck,
  requireAuthentication,
  (theRequest: Request, theResponse: Response) => {
    theResponse.send({ currentUser: theRequest.currentUser || null });
  }
);

export { router as currentUserRouter };

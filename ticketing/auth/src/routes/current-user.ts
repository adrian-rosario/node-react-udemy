import express, { Request, Response, NextFunction } from "express";
import { currentUserCheck } from "../util/current-user-check";
import { requireAuthentication } from "../util/requireAuthentication";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUserCheck,
  // requireAuthentication, // TODO: reivew, causing requests to fail
  (req: Request, res: Response) => {
    res.send({ currentUser: req.currentUser || null });
  }
);

export { router as currentUserRouter };

import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { currentUserCheck } from "../util/current-user-check";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  (theRequest: Request, theResponse: Response) => {
    // - moved to currentUserCheck
    //
    // if (!theRequest.session?.jwt) {
    //   return theResponse.send({ currentUser: null });
    // }
    // try {
    //   const webTokenPayload = jwt.verify(
    //     theRequest.session.jwt,
    //     process.env.JWT_KEY!
    //   );
    //   theResponse.send({ currentUser: webTokenPayload });
    // } catch (theError) {
    //   theResponse.send({ currentUser: null });
    // }
    //
    theResponse.send({ currentUser: theRequest.currentUser || null });
  }
);

export { router as currentUserRouter };

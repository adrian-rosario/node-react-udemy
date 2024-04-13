import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.get(
  "/api/users/currentuser",
  (theRequest: Request, theResponse: Response) => {
    //
    if (!theRequest.session?.jwt) {
      return theResponse.send({ currentUser: null });
    }

    try {
      const webTokenPayload = jwt.verify(
        theRequest.session.jwt,
        process.env.JWT_KEY!
      );
      theResponse.send({ currentUser: webTokenPayload });
    } catch (theError) {
      theResponse.send({ currentUser: null });
    }

    // theResponse.send("/currentuser route");
  }
);

export { router as currentUserRouter };

import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
// import { BadRequestError } from "../middleware/errors/error-bad-request";

interface UserPayload {
  id: string;
  email: string;
}

// take an existing type
// definition add modify it
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

/**
 * shared feature so we can validate a user's logged in satus
 * - extract the JWT payload and set it as req.currentUser
 */

export const currentUserCheck = (
  req: Request,
  theResponse: Response,
  theNext: NextFunction
) => {
  // is session defined, is jwt defined
  if (!req.session?.jwt) {
    return theNext();
  }

  try {
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayload;

    req.currentUser = payload;
  } catch (theError) {
    // throw new BadRequestError("User check, bad request.");
  }

  theNext();
};

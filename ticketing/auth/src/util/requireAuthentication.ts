import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../middleware/errors/error-unauthorized";

/**
 * reject the request if the user is not logged in
 */

export const requireAuthentication = (
  theRequest: Request,
  theResponse: Response,
  theNext: NextFunction
) => {
  if (!theRequest.currentUser) {
    throw new UnauthorizedError();
  }
  theNext();
};

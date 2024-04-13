import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "./errors/error-request-validation";

export const validateRequest = (
  theRequest: Request,
  theResponse: Response,
  theNextFunction: NextFunction
) => {
  const errors = validationResult(theRequest);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  theNextFunction();
};

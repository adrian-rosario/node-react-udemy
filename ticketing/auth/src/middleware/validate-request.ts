import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { RequestValidationError } from "./errors/error-request-validation";

export const validateRequest = (
  req: Request,
  theResponse: Response,
  theNextFunction: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  theNextFunction();
};

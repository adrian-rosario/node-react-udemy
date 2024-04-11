import { ValidationError } from "express-validator";

export class RequestValidationError extends Error {
  constructor(public validationErrors: ValidationError[]) {
    super();

    // bc we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}

import { ValidationError } from "express-validator";
import { CustomError } from "./error-custom";

export class RequestValidationError extends CustomError {
  statusCode = 400; // bad request

  constructor(public validationErrors: ValidationError[]) {
    super("Request Validation error.");

    // bc we are extending a built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.validationErrors.map((theError) => {
      if (theError.type === "field") {
        return { message: theError.msg, field: theError.path };
      }
      return { message: theError.msg };
    });
  }
}

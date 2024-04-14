import { CustomError } from "./error-custom";

export class UnauthorizedError extends CustomError {
  statusCode = 401; // unauthorized
  reason = "Unauthorized user";

  constructor() {
    super("User check error.");
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}

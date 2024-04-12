import { CustomError } from "./error-custom";

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor() {
    super("URL not found error.");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [{ message: "URL / path not found" }];
  }
}

import { CustomError } from "./error-custom";

export class DatabaseConnectionError extends CustomError {
  reason = "Error connecting to database.";
  statusCode = 500; // internal server error

  constructor() {
    super("Database Connection error.");

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  serializeErrors() {
    return [{ message: this.reason }];
  }
}

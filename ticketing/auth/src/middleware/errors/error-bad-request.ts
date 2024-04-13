import { CustomError } from "./error-custom";

export class BadRequestError extends CustomError {
  statusCode = 400; // bad request

  constructor(private theMessage: string) {
    super(theMessage);

    // bc extending a class to built in JS class
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors() {
    return [{ message: this.theMessage }];
  }
}

import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "./errors/error-request-validation";
import { DatabaseConnectionError } from "./errors/error-database-connection";
import { CustomError } from "./errors/error-custom";

export const errorHandler = (
  theError: Error,
  theRequest: Request,
  theResponse: Response,
  theNextFunction: NextFunction
) => {
  console.log(" ===== Error, from error handler =====\n", theError);

  // use our custom error handling w/ abstract...
  if (theError instanceof CustomError) {
    return theResponse.status(theError.statusCode).send({
      errors: theError.serializeErrors(),
    });
  }

  /*
  if (theError instanceof RequestValidationError) {
    console.log("> Handling request validation error");

    theResponse
      .status(theError.statusCode)
      .send({ errors: theError.serializeErrors() });
  }

  // use our custom validators...
  if (theError instanceof DatabaseConnectionError) {
    console.log("> Handling database connection error");
    return theResponse
      .status(theError.statusCode)
      .send({ errors: theError.serializeErrors() });
  }
  */

  theResponse.status(400).send({
    errors: [{ message: "Error encountered" }],
  });
};

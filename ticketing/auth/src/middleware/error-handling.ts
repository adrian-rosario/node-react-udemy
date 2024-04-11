import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "./errors/error-request-validation";
import { DatabaseConnectionError } from "./errors/error-database-connection";

export const errorHandler = (
  theError: Error,
  theRequest: Request,
  theResponse: Response,
  theNextFunction: NextFunction
) => {
  console.log(" ===== Error, from error handler =====\n", theError);

  // use our custom validators...
  if (theError instanceof RequestValidationError) {
    console.log("> Handling request validation error");

    const formattedError = theError.validationErrors.map((error) => {
      if (error.type === "field") {
        return { message: error.msg, field: error.path };
      }
    });
    theResponse.status(400).send({ errors: formattedError });
  }

  // use our custom validators...
  if (theError instanceof DatabaseConnectionError) {
    console.log("> Handling database connection error");
    return theResponse
      .status(500)
      .send({ errors: [{ message: theError.reason }] });
  }

  theResponse.status(400).send({
    errors: [{ message: "Error encountered" }],
  });
};

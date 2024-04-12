import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
// import { errorHandler } from "../middleware/error-handling";
import { RequestValidationError } from "../middleware/errors/error-request-validation";
import { DatabaseConnectionError } from "../middleware/errors/error-database-connection";

const router = express.Router();

router.get(
  "/api/users/signup",
  // validation middleware
  [
    body("email").isEmail().withMessage("Please use a valid email address"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Please use a valid password length"),
  ],
  async (theRequest: Request, theResponse: Response) => {
    const { email, password } = theRequest.body;

    const errors = validationResult(theRequest);
    if (!errors.isEmpty()) {
      // return res.status(400).send(errors.array());
      // throw new Error("No empty fields.");
      throw new RequestValidationError(errors.array());
    }

    if (!email || typeof email !== "string") {
      // res.status(400).send("provide email / password");
      throw new Error("Details are not what we expected");
    }

    console.log("signup, create new user...");
    throw new DatabaseConnectionError();

    theResponse.send("/signup route");
  }
);

export { router as signUpRouter };

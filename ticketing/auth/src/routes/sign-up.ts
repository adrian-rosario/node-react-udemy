import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { RequestValidationError } from "../middleware/errors/error-request-validation";
// import { DatabaseConnectionError } from "../middleware/errors/error-database-connection"; // test code
import { User } from "../models/model-user";
import { BadRequestError } from "../middleware/errors/error-bad-request";

const router = express.Router();

router.get(
  "/api/users/signup",
  //
  // validation middleware
  [
    body("email").isEmail().withMessage("Please use a valid email address"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Please use a valid password length"),
  ],
  //
  //
  async (theRequest: Request, theResponse: Response) => {
    const { email, password } = theRequest.body;
    const existingUser = await User.findOne({ email });

    // Request Validation
    const errors = validationResult(theRequest);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    if (!email || typeof email !== "string") {
      throw new Error("Please use a valid email.");
    }
    //

    if (existingUser) {
      throw new BadRequestError("User already exists, cannot create account.");
    }

    const newUser = User.build({ email, password });
    await newUser.save(); // persist to mongodb

    theResponse.status(201).send(newUser); // Created
  }
);

export { router as signUpRouter };

import express, { Request, Response } from "express";
import { body } from "express-validator";
import { User } from "../models/model-user";
import { BadRequestError } from "../middleware/errors/error-bad-request";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middleware/validate-request";

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
  validateRequest,
  //
  async (theRequest: Request, theResponse: Response) => {
    const { email, password } = theRequest.body;
    const existingUser = await User.findOne({ email });

    // Request Validation
    if (!email || typeof email !== "string") {
      throw new Error("Please use a valid email.");
    }
    //

    if (existingUser) {
      throw new BadRequestError("User already exists, cannot create account.");
    }

    const newUser = User.build({ email, password });
    await newUser.save(); // persist to mongodb

    // generate jwt, store on session object
    const userJsonWebToken = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
      },
      process.env.JWT_KEY!
    );
    theRequest.session = { jwt: userJsonWebToken };

    theResponse.status(201).send(newUser); // Created
  }
);

export { router as signUpRouter };

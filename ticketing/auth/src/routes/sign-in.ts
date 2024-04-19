import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest, BadRequestError } from "@agrtickets/common";
import { User } from "../models/model-user";
import { PasswordManager } from "../util/password-manager";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post(
  "/api/users/signin",
  // validation
  [
    body("email").isEmail().withMessage("Please use a valid email"),
    body("password").trim().notEmpty().withMessage("Please use a valid email"),
  ],
  //
  validateRequest,
  //
  async (theRequest: Request, theResponse: Response) => {
    const { email, password } = theRequest.body;

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      throw new BadRequestError("Bad login");
    }

    const passwordMatch = await PasswordManager.compare(
      existingUser.password,
      password
    );

    if (!passwordMatch) {
      throw new BadRequestError("Invalid credentials");
    }

    // generate jwt, store on session object
    const userJsonWebToken = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      process.env.JWT_KEY!
    );
    theRequest.session = { jwt: userJsonWebToken };

    theResponse.status(200).send(existingUser); // OK
  }
);

export { router as signInRouter };

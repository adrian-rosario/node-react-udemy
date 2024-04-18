import express, { Request, Response } from "express";
import { body } from "express-validator";
import { validateRequest } from "../middleware/validate-request";
import { User } from "../models/model-user";
import { BadRequestError } from "../middleware/errors/error-bad-request";
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
  async (req: Request, theResponse: Response) => {
    const { email, password } = req.body;

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
    req.session = { jwt: userJsonWebToken };

    theResponse.status(200).send(existingUser); // OK
  }
);

export { router as signInRouter };

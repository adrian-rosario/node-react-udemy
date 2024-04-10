import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";

const router = express.Router();

router.get(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("use a valid email address, please"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      // .isStrongPassword()
      .withMessage("Use a valid strong password"),
  ],
  (req: Request, res: Response) => {
    const { email, password } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send(errors.array());
    }

    if (!email || typeof email !== "string") {
      res.status(400).send("provide email / password");
    }

    res.send("/signup route");
  }
);

export { router as signUpRouter };

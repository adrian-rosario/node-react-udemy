import express, { Request, Response } from "express";

const router = express.Router();

router.post(
  "/api/users/signout",
  (theRequest: Request, theResponse: Response) => {
    // expunge cookie
    theRequest.session = null;

    theResponse.send("Signed out");
  }
);

export { router as signOutRouter };

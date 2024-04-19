import express from "express";
import { currentUserCheck } from "@agrtickets/common";

const router = express.Router();

router.get("/api/users/currentuser", currentUserCheck, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };

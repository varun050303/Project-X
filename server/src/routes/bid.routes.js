import express from "express";
import { authenticate, authorize } from "../middlewares/authHandler.js";
import * as bidController from "../controllers/bid.controller.js";

const router = express.Router();

router.post(
  "/create",
  authenticate,
  authorize("WORKER"),
  bidController.createBid
);

router.get(
  "/:id/bid-status",
  authenticate,
  authorize("WORKER"),
  bidController.hasWorkerPlacedBid
);

router.get(
  "/:id/get/all",
  authenticate,
  authorize("CLIENT"),
  bidController.getAllBids
);

export default router;

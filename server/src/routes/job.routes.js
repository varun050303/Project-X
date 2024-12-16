import express from "express";
import { authenticate, authorize } from "../middlewares/authHandler.js";
import * as jobController from "../controllers/job.controller.js";

const router = express.Router();

router.post(
  "/create",
  authenticate,
  authorize("CLIENT"),
  jobController.createJob
);
router.get("/get", authenticate, authorize("CLIENT"), jobController.getMyJobs);
router.get(
  "/get/all",
  authenticate,
  authorize("WORKER"),
  jobController.getAllJobs
);
router.get("/get/:id", authenticate, jobController.getJobById);
router.delete(
  "/delete/:id",
  authorize("CLIENT", "ADMIN"),
  authenticate,
  jobController.deleteJobById
);

export default router;

import express from "express";
import { authenticate } from "../middlewares/authHandler.js";
import * as jobController from "../controllers/job.controller.js";

const router = express.Router();

router.post("/create", authenticate, jobController.createJob);
router.get("/get", authenticate, jobController.getJobs);

export default router;

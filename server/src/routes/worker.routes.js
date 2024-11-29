import express from "express";
import * as workerController from "../controllers/worker.controller.js";

const router = express.Router();

router.get("/get", workerController.getWorkers);

export default router;

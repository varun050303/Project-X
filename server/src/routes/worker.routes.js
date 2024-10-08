import express from 'express';
import * as workerController from '../controllers/worker.controller.js';

const router = express.Router();

router.get('/', workerController.getWorkers);
router.get('/:id', workerController.getWorkerById);
router.post('/', workerController.createWorker);
router.delete('/', workerController.deleteWorker);

export default router;
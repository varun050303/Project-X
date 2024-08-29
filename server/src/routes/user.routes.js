import express from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from "../middlewares/authHandler.js"
const router = express.Router();



router.get('/', userController.getUsers);
router.get('/me', userController.getCurrentUser)
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.delete('/', userController.deleteUser);

export default router;
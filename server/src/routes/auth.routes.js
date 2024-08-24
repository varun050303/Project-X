import express from 'express';
import { refreshAccessToken } from '../controllers/auth.controller.js';
import { handleGoogleAuth, handleGoogleAuthCallback } from '../controllers/googleAuthController.js';

const router = express.Router();

router.post('/refresh-token', refreshAccessToken);
router.get('/google', handleGoogleAuth);
router.get('/google/callback', handleGoogleAuthCallback);



export default router;
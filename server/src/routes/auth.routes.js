import express from 'express';
import { refreshAccessToken, verifyToken } from '../controllers/auth.controller.js';
import { handleGoogleAuth, handleGoogleAuthCallback } from '../controllers/googleAuth.controller.js';

const router = express.Router();

router.post('/refresh-token', refreshAccessToken);
router.get('/google', handleGoogleAuth);
router.get('/google/callback', handleGoogleAuthCallback);
router.get('/verify-token', verifyToken);



export default router;
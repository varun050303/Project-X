import express from 'express';
import { refreshAccessToken } from '../controllers/auth.controller.js';
import { generateGoogleAuthUrl, handleGoogleLogin } from '../googleAuth/googleAuthController.js';

const router = express.Router();

router.post('/refresh-token', refreshAccessToken);
router.get('/google/url', generateGoogleAuthUrl)
router.get('/google/callback', handleGoogleLogin)


export default router;
import express from 'express';
import { refreshAccessToken, getGoogleAuthUrl, getGoogleUserToken, getCurrentUser } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/refresh-token', refreshAccessToken);
router.get('/google/url', getGoogleAuthUrl)
router.get('/google', getGoogleUserToken)
router.get('/me', getCurrentUser)


export default router;
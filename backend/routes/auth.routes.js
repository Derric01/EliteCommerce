import express from 'express';
import { login, logout, signup, refreshAccessToken, getProfile } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

// Test endpoint for connectivity
router.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!', timestamp: new Date().toISOString() });
});

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh-token', refreshAccessToken);
router.get('/profile', protectRoute,getProfile);

export default router;
import express from 'express';
import {
  getHomeSettings,
  updateHomeSettings,
  getAboutSettings,
  updateAboutSettings
} from '../controllers/settingsController.js';
import { authenticateToken, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/home', getHomeSettings);
router.get('/about', getAboutSettings);

// Protected admin routes
router.put('/home', authenticateToken, isAdmin, updateHomeSettings);
router.put('/about', authenticateToken, isAdmin, updateAboutSettings);

export default router;

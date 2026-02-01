import express from 'express';
import { getMetrics } from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/metrics', authenticateToken, getMetrics);

export default router;

import express from 'express';
import { createShipment, getShipments, updateShipmentStatus } from '../controllers/shipmentController.js';
import { authenticateToken, requireAdmin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.get('/', authenticateToken, getShipments);
router.post('/', authenticateToken, requireAdmin, createShipment);
router.patch('/:id/status', authenticateToken, requireAdmin, updateShipmentStatus);

export default router;

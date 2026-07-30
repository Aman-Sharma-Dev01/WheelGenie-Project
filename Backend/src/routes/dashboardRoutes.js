import express from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.get('/client', dashboardController.getClientDashboard);
router.get('/admin', restrictTo('official', 'admin'), dashboardController.getAdminDashboard);

export default router;
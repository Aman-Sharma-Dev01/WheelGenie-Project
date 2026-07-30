import express from 'express';
import * as analyticsController from '../controllers/analyticsController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const router = express.Router();

router.use(protect);
router.use(restrictTo('official', 'admin'));

const dateRangeSchema = z.object({
  query: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional()
  })
});

router.get('/overview', validate(dateRangeSchema), analyticsController.getOverviewAnalytics);
router.get('/sales', validate(dateRangeSchema), analyticsController.getSalesAnalytics);
router.get('/test-drives', validate(dateRangeSchema), analyticsController.getTestDriveAnalytics);
router.get('/inquiries', validate(dateRangeSchema), analyticsController.getInquiryAnalytics);
router.get('/sell-requests', validate(dateRangeSchema), analyticsController.getSellRequestAnalytics);

export default router;
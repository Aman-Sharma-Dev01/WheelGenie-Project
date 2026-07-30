import express from 'express';
import * as timelineController from '../controllers/timelineController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'ID is required' }).length(24, 'Invalid ID')
  })
});

const router = express.Router();

router.use(protect);
router.get('/sell-request/:id', validate(idParamSchema), timelineController.getSellRequestTimeline);
router.get('/deal/:id', validate(idParamSchema), timelineController.getDealTimeline);
router.get('/paperwork/:id', validate(idParamSchema), timelineController.getPaperworkTimeline);

export default router;
import express from 'express';
import * as meetingController from '../controllers/meetingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Meeting ID is required' }).length(24, 'Invalid meeting ID')
  })
});

const rescheduleSchema = z.object({
  body: z.object({
    preferredDate: z.string({ required_error: 'Preferred date is required' }),
    reason: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Meeting ID is required' }).length(24, 'Invalid meeting ID')
  })
});

const cancelSchema = z.object({
  body: z.object({
    reason: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Meeting ID is required' }).length(24, 'Invalid meeting ID')
  })
});

const feedbackSchema = z.object({
  body: z.object({
    feedback: z.string().optional(),
    rating: z.number().min(1).max(5).optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Meeting ID is required' }).length(24, 'Invalid meeting ID')
  })
});

const myMeetingsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
    status: z.enum(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected', 'rescheduled']).optional(),
    type: z.enum(['inspection', 'test_drive', 'handover', 'document_verification', 'other']).optional()
  })
});

const router = express.Router();

router.use(protect);

router.get('/my', validate(myMeetingsSchema), meetingController.getMyMeetings);
router.get('/:id', validate(idParamSchema), meetingController.getMeetingByIdClient);
router.post('/:id/confirm', validate(idParamSchema), meetingController.confirmMeeting);
router.post('/:id/reschedule', validate(rescheduleSchema), meetingController.requestReschedule);
router.post('/:id/cancel', validate(cancelSchema), meetingController.cancelMeeting);
router.post('/:id/feedback', validate(feedbackSchema), meetingController.submitFeedback);

export default router;
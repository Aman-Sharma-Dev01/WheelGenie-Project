import express from 'express';
import * as meetingController from '../controllers/meetingController.js';
import * as meetingClientController from '../controllers/meetingClientController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Meeting ID is required' }).length(24, 'Invalid meeting ID')
  })
});

const createMeetingSchema = z.object({
  body: z.object({
    sellRequestId: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID'),
    type: z.enum(['inspection', 'test_drive', 'handover', 'document_verification', 'other']).default('inspection'),
    scheduledDate: z.string({ required_error: 'Scheduled date is required' }),
    durationMinutes: z.number().min(15).max(480).default(60).optional(),
    location: z.object({
      type: z.enum(['Point', 'physical', 'virtual']).default('Point'),
      coordinates: z.array(z.number()).length(2).optional(),
      address: z.string().optional(),
      venue: z.enum(['wheelgenie_center', 'client_location', 'dealership', 'virtual', 'other']).default('wheelgenie_center'),
      meetingLink: z.string().optional()
    }).optional(),
    officialId: z.string().length(24, 'Invalid official ID').optional()
  })
});

const updateMeetingSchema = z.object({
  body: z.object({
    type: z.enum(['inspection', 'test_drive', 'handover', 'document_verification', 'other']).optional(),
    scheduledDate: z.string().optional(),
    durationMinutes: z.number().min(15).max(480).optional(),
    location: z.object({
      type: z.enum(['Point', 'physical', 'virtual']).optional(),
      coordinates: z.array(z.number()).length(2).optional(),
      address: z.string().optional(),
      venue: z.enum(['wheelgenie_center', 'client_location', 'dealership', 'virtual', 'other']).optional(),
      meetingLink: z.string().optional()
    }).optional(),
    official: z.string().length(24, 'Invalid official ID').optional(),
    officialNotes: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Meeting ID is required' }).length(24, 'Invalid meeting ID')
  })
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected', 'rescheduled']),
    officialNotes: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Meeting ID is required' }).length(24, 'Invalid meeting ID')
  })
});

const getAllMeetingsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    status: z.enum(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected', 'rescheduled']).optional(),
    type: z.enum(['inspection', 'test_drive', 'handover', 'document_verification', 'other']).optional(),
    official: z.string().length(24, 'Invalid official ID').optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional()
  })
});

const getMyMeetingsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
    status: z.enum(['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected', 'rescheduled']).optional(),
    type: z.enum(['inspection', 'test_drive', 'handover', 'document_verification', 'other']).optional()
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
    feedback: z.string({ required_error: 'Feedback is required' }).min(1),
    rating: z.number().min(1).max(5).optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Meeting ID is required' }).length(24, 'Invalid meeting ID')
  })
});

const router = express.Router();

router.use(protect);
router.use(restrictTo('official', 'admin'));

router.post('/', validate(createMeetingSchema), meetingController.createMeeting);
router.get('/', validate(getAllMeetingsSchema), meetingController.getAllMeetings);
router.get('/:id', validate(idParamSchema), meetingController.getMeetingByIdAdmin);
router.put('/:id', validate(updateMeetingSchema), meetingController.updateMeeting);
router.put('/:id/status', validate(updateStatusSchema), meetingController.updateMeetingStatus);
router.delete('/:id', validate(idParamSchema), meetingController.deleteMeeting);

export default router;
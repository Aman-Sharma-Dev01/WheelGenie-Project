import express from 'express';
import * as testDriveClientController from '../controllers/testDriveClientController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Test drive ID is required' }).length(24, 'Invalid test drive ID')
  })
});

const createTestDriveSchema = z.object({
  body: z.object({
    carId: z.string({ required_error: 'Car ID is required' }).length(24, 'Invalid car ID'),
    scheduledDate: z.string({ required_error: 'Scheduled date is required' }),
    durationMinutes: z.number().min(15).max(120).default(30).optional(),
    location: z.object({
      type: z.enum(['Point', 'physical']).default('physical'),
      coordinates: z.array(z.number()).length(2).optional(),
      address: z.string().optional(),
      venue: z.enum(['wheelgenie_center', 'dealership', 'client_location', 'other']).default('wheelgenie_center')
    }).optional(),
    notes: z.string().optional()
  })
});

const rescheduleSchema = z.object({
  body: z.object({
    newDate: z.string({ required_error: 'New date is required' }),
    reason: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Test drive ID is required' }).length(24, 'Invalid test drive ID')
  })
});

const cancelSchema = z.object({
  body: z.object({
    reason: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Test drive ID is required' }).length(24, 'Invalid test drive ID')
  })
});

const myTestDrivesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).default(10).optional(),
    status: z.enum(['requested', 'approved', 'rejected', 'scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled']).optional()
  })
});

const router = express.Router();

router.use(protect);

router.post('/', validate(createTestDriveSchema), testDriveClientController.createTestDrive);
router.get('/my', validate(myTestDrivesSchema), testDriveClientController.getMyTestDrives);
router.get('/:id', validate(idParamSchema), testDriveClientController.getTestDriveById);
router.put('/:id/reschedule', validate(rescheduleSchema), testDriveClientController.rescheduleTestDrive);
router.post('/:id/cancel', validate(cancelSchema), testDriveClientController.cancelTestDrive);

export default router;
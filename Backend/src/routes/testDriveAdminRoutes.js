import express from 'express';
import * as testDriveAdminController from '../controllers/testDriveAdminController.js';
import * as testDriveClientController from '../controllers/testDriveClientController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
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

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['requested', 'approved', 'rejected', 'scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled']),
    officialNotes: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Test drive ID is required' }).length(24, 'Invalid test drive ID')
  })
});

const approveSchema = z.object({
  body: z.object({
    scheduledDate: z.string().optional(),
    officialNotes: z.string().optional(),
    officialId: z.string().length(24, 'Invalid official ID').optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Test drive ID is required' }).length(24, 'Invalid test drive ID')
  })
});

const rejectSchema = z.object({
  body: z.object({
    reason: z.string({ required_error: 'Rejection reason is required' }).min(1)
  }),
  params: z.object({
    id: z.string({ required_error: 'Test drive ID is required' }).length(24, 'Invalid test drive ID')
  })
});

const completeSchema = z.object({
  body: z.object({
    officialNotes: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Test drive ID is required' }).length(24, 'Invalid test drive ID')
  })
});

const getAllSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    status: z.enum(['requested', 'approved', 'rejected', 'scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled']).optional(),
    car: z.string().length(24, 'Invalid car ID').optional(),
    client: z.string().length(24, 'Invalid client ID').optional(),
    official: z.string().length(24, 'Invalid official ID').optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional()
  })
});

const router = express.Router();

router.use(protect);
router.use(restrictTo('official', 'admin'));

router.get('/', validate(getAllSchema), testDriveAdminController.getAllTestDrives);
router.get('/:id', validate(idParamSchema), testDriveAdminController.getTestDriveByIdAdmin);
router.put('/:id/status', validate(updateStatusSchema), testDriveAdminController.updateTestDriveStatus);
router.post('/:id/approve', validate(approveSchema), testDriveAdminController.approveTestDrive);
router.post('/:id/reject', validate(rejectSchema), testDriveAdminController.rejectTestDrive);
router.post('/:id/complete', validate(completeSchema), testDriveAdminController.completeTestDrive);

export default router;
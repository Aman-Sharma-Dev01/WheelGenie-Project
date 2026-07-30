import express from 'express';
import * as sellRequestAdminController from '../controllers/sellRequestAdminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID')
  })
});

const scheduleInspectionSchema = z.object({
  body: z.object({
    inspectionDate: z.string({ required_error: 'Inspection date is required' }),
    notes: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID')
  })
});

const completeInspectionSchema = z.object({
  body: z.object({
    inspectionNotes: z.string().optional(),
    officialNotes: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID')
  })
});

const approveSellRequestSchema = z.object({
  body: z.object({
    listingPrice: z.number().min(0).optional(),
    description: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID')
  })
});

const rejectSellRequestSchema = z.object({
  body: z.object({
    reason: z.string({ required_error: 'Rejection reason is required' }).min(1)
  }),
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID')
  })
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'inspection_scheduled', 'inspection_completed', 'approved', 'rejected', 'listed', 'cancelled']),
    officialNotes: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID')
  })
});

const getAllSellRequestsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    status: z.enum(['pending', 'inspection_scheduled', 'inspection_completed', 'approved', 'rejected', 'listed', 'cancelled']).optional(),
    search: z.string().optional()
  })
});

const assignOfficialSchema = z.object({
  body: z.object({
    officialId: z.string({ required_error: 'Official ID is required' }).length(24, 'Invalid official ID')
  }),
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID')
  })
});

const requestMoreDetailsSchema = z.object({
  body: z.object({
    message: z.string({ required_error: 'Message is required' }).min(1)
  }),
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID')
  })
});

const updateSellRequestSchema = z.object({
  body: z.object({
    brand: z.string().trim().min(1).optional(),
    model: z.string().trim().min(1).optional(),
    variant: z.string().trim().min(1).optional(),
    fuel: z.enum(['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']).optional(),
    transmission: z.enum(['Manual', 'Automatic']).optional(),
    kms: z.number().min(0).optional(),
    year: z.number().min(1901).max(new Date().getFullYear() + 1).optional(),
    ownership: z.number().min(1).optional(),
    city: z.string().trim().min(1).optional(),
    expectedPrice: z.number().min(0).optional(),
    description: z.string().optional(),
    inspectionDate: z.string().optional(),
    inspectionNotes: z.string().optional(),
    officialNotes: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID')
  })
});

const router = express.Router();

router.use(protect);
router.use(restrictTo('official', 'admin'));

router.get('/', validate(getAllSellRequestsSchema), sellRequestAdminController.getAllSellRequests);
router.get('/:id', validate(idParamSchema), sellRequestAdminController.getSellRequestByIdAdmin);
router.put('/:id', validate(updateSellRequestSchema), sellRequestAdminController.updateSellRequestAdmin);
router.put('/:id/status', validate(updateStatusSchema), sellRequestAdminController.updateSellRequestStatus);
router.post('/:id/assign-official', validate(assignOfficialSchema), sellRequestAdminController.assignOfficial);
router.post('/:id/request-more-details', validate(requestMoreDetailsSchema), sellRequestAdminController.requestMoreDetails);
router.post('/:id/reject', validate(rejectSellRequestSchema), sellRequestAdminController.rejectSellRequest);
router.post('/:id/approve', validate(approveSellRequestSchema), sellRequestAdminController.approveSellRequest);

export default router;
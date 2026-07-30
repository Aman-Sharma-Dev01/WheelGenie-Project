import express from 'express';
import * as dealAdminController from '../controllers/dealAdminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Deal ID is required' }).length(24, 'Invalid deal ID')
  })
});

const createDealSchema = z.object({
  body: z.object({
    carId: z.string({ required_error: 'Car ID is required' }).length(24, 'Invalid car ID'),
    clientId: z.string({ required_error: 'Client ID is required' }).length(24, 'Invalid client ID'),
    agreedPrice: z.number({ required_error: 'Agreed price is required' }).min(0),
    sellRequestId: z.string().length(24, 'Invalid sell request ID').optional(),
    milestones: z.array(z.object({
      title: z.string({ required_error: 'Milestone title is required' }),
      description: z.string().optional(),
      dueDate: z.string().optional()
    })).optional()
  })
});

const updateDealSchema = z.object({
  body: z.object({
    agreedPrice: z.number().min(0).optional(),
    milestones: z.array(z.object({
      title: z.string({ required_error: 'Milestone title is required' }),
      description: z.string().optional(),
      dueDate: z.string().optional()
    })).optional(),
    paymentDetails: z.object({
      amount: z.number().min(0).optional(),
      method: z.enum(['cash', 'bank_transfer', 'cheque', 'loan', 'other']).optional(),
      receivedAt: z.string().optional(),
      reference: z.string().optional(),
      notes: z.string().optional()
    }).optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Deal ID is required' }).length(24, 'Invalid deal ID')
  })
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['draft', 'pending_payment', 'payment_received', 'documents_pending', 'completed', 'cancelled']),
    paymentDetails: z.object({
      amount: z.number().min(0).optional(),
      method: z.enum(['cash', 'bank_transfer', 'cheque', 'loan', 'other']).optional(),
      receivedAt: z.string().optional(),
      reference: z.string().optional(),
      notes: z.string().optional()
    }).optional(),
    cancellationReason: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Deal ID is required' }).length(24, 'Invalid deal ID')
  })
});

const cancelDealSchema = z.object({
  body: z.object({
    reason: z.string({ required_error: 'Cancellation reason is required' }).min(1)
  }),
  params: z.object({
    id: z.string({ required_error: 'Deal ID is required' }).length(24, 'Invalid deal ID')
  })
});

const getAllDealsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    status: z.enum(['draft', 'pending_payment', 'payment_received', 'documents_pending', 'completed', 'cancelled']).optional(),
    car: z.string().length(24, 'Invalid car ID').optional(),
    client: z.string().length(24, 'Invalid client ID').optional(),
    official: z.string().length(24, 'Invalid official ID').optional()
  })
});

const router = express.Router();

router.use(protect);
router.use(restrictTo('official', 'admin'));

router.post('/', validate(createDealSchema), dealAdminController.createDeal);
router.get('/', validate(getAllDealsSchema), dealAdminController.getAllDeals);
router.get('/:id', validate(idParamSchema), dealAdminController.getDealByIdAdmin);
router.put('/:id', validate(updateDealSchema), dealAdminController.updateDeal);
router.put('/:id/status', validate(updateStatusSchema), dealAdminController.updateDealStatus);
router.post('/:id/cancel', validate(cancelDealSchema), dealAdminController.cancelDeal);
router.post('/:id/complete', validate(idParamSchema), dealAdminController.completeDeal);

export default router;
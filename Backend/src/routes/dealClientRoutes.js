import express from 'express';
import * as dealClientController from '../controllers/dealClientController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Deal ID is required' }).length(24, 'Invalid deal ID')
  })
});

const myDealsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).default(10).optional(),
    status: z.enum(['draft', 'pending_payment', 'payment_received', 'documents_pending', 'completed', 'cancelled']).optional()
  })
});

const router = express.Router();

router.use(protect);

router.get('/my', validate(myDealsSchema), dealClientController.getMyDeals);
router.get('/:id', validate(idParamSchema), dealClientController.getDealById);

export default router;
import express from 'express';
import * as paperworkClientController from '../controllers/paperworkClientController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Paperwork ID is required' }).length(24, 'Invalid paperwork ID')
  })
});

const myPaperworksSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).default(10).optional(),
    status: z.enum(['initiated', 'documents_uploaded', 'under_review', 'client_action_required', 'completed', 'rejected']).optional()
  })
});

const router = express.Router();

router.use(protect);

router.get('/my', validate(myPaperworksSchema), paperworkClientController.getMyPaperworks);
router.get('/:id', validate(idParamSchema), paperworkClientController.getPaperworkById);
router.get('/:id/documents', validate(idParamSchema), paperworkClientController.getPaperworkDocuments);

export default router;
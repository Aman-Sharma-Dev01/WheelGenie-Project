import express from 'express';
import * as inquiryAdminController from '../controllers/inquiryAdminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Inquiry ID is required' }).length(24, 'Invalid inquiry ID')
  })
});

const replySchema = z.object({
  body: z.object({
    message: z.string({ required_error: 'Message is required' }).min(1).max(2000)
  }),
  params: z.object({
    id: z.string({ required_error: 'Inquiry ID is required' }).length(24, 'Invalid inquiry ID')
  })
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['open', 'in_progress', 'replied', 'closed']),
    officialNotes: z.string().max(2000).optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Inquiry ID is required' }).length(24, 'Invalid inquiry ID')
  })
});

const getAllInquiriesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    status: z.enum(['open', 'in_progress', 'replied', 'closed']).optional(),
    car: z.string().length(24, 'Invalid car ID').optional(),
    client: z.string().length(24, 'Invalid client ID').optional(),
    official: z.string().length(24, 'Invalid official ID').optional()
  })
});

const router = express.Router();

router.use(protect);
router.use(restrictTo('official', 'admin'));

router.get('/', validate(getAllInquiriesSchema), inquiryAdminController.getAllInquiries);
router.get('/:id', validate(idParamSchema), inquiryAdminController.getInquiryByIdAdmin);
router.post('/:id/reply', validate(replySchema), inquiryAdminController.replyToInquiry);
router.put('/:id/status', validate(updateStatusSchema), inquiryAdminController.updateInquiryStatus);

export default router;
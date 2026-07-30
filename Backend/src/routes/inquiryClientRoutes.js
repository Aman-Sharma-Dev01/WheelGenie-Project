import express from 'express';
import * as inquiryClientController from '../controllers/inquiryClientController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Inquiry ID is required' }).length(24, 'Invalid inquiry ID')
  })
});

const createInquirySchema = z.object({
  body: z.object({
    carId: z.string({ required_error: 'Car ID is required' }).length(24, 'Invalid car ID'),
    subject: z.string({ required_error: 'Subject is required' }).min(1).max(200),
    message: z.string({ required_error: 'Message is required' }).min(1).max(2000)
  })
});

const myInquiriesSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
    status: z.enum(['open', 'in_progress', 'replied', 'closed']).optional()
  })
});

const router = express.Router();

router.use(protect);

router.post('/', validate(createInquirySchema), inquiryClientController.createInquiry);
router.get('/my', validate(myInquiriesSchema), inquiryClientController.getMyInquiries);
router.get('/:id', validate(idParamSchema), inquiryClientController.getInquiryById);
router.post('/:id/close', validate(idParamSchema), inquiryClientController.closeInquiry);

export default router;
import express from 'express';
import * as paperworkAdminController from '../controllers/paperworkAdminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Paperwork ID is required' }).length(24, 'Invalid paperwork ID')
  })
});

const createPaperworkSchema = z.object({
  body: z.object({
    dealId: z.string({ required_error: 'Deal ID is required' }).length(24, 'Invalid deal ID')
  })
});

const updatePaperworkSchema = z.object({
  body: z.object({
    officialNotes: z.string().max(2000).optional(),
    documents: z.array(z.object({
      name: z.string({ required_error: 'Document name is required' }),
      type: z.enum(['sale_agreement', 'rc_transfer', 'insurance_transfer', 'noc', 'payment_receipt', 'loan_documents', 'delivery_receipt', 'other']),
      url: z.string({ required_error: 'Document URL is required' }),
      publicId: z.string().optional(),
      uploadedBy: z.string().length(24).optional(),
      uploadedAt: z.string().optional(),
      verified: z.boolean().optional(),
      verifiedAt: z.string().optional(),
      verifiedBy: z.string().length(24).optional()
    })).optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Paperwork ID is required' }).length(24, 'Invalid paperwork ID')
  })
});

const uploadDocumentSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Document name is required' }),
    type: z.enum(['sale_agreement', 'rc_transfer', 'insurance_transfer', 'noc', 'payment_receipt', 'loan_documents', 'delivery_receipt', 'other'], { required_error: 'Document type is required' }),
    url: z.string({ required_error: 'Document URL is required' }),
    publicId: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Paperwork ID is required' }).length(24, 'Invalid paperwork ID')
  })
});

const deleteDocumentSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Paperwork ID is required' }).length(24, 'Invalid paperwork ID'),
    documentId: z.string({ required_error: 'Document ID is required' })
  })
});

const updateStatusSchema = z.object({
  body: z.object({
    status: z.enum(['initiated', 'documents_uploaded', 'under_review', 'client_action_required', 'completed', 'rejected']),
    officialNotes: z.string().max(2000).optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Paperwork ID is required' }).length(24, 'Invalid paperwork ID')
  })
});

const router = express.Router();

router.use(protect);
router.use(restrictTo('official', 'admin'));

router.post('/', validate(createPaperworkSchema), paperworkAdminController.createPaperwork);
router.get('/:id', validate(idParamSchema), paperworkAdminController.getPaperworkByIdAdmin);
router.put('/:id', validate(updatePaperworkSchema), paperworkAdminController.updatePaperwork);
router.post('/:id/upload', validate(uploadDocumentSchema), paperworkAdminController.uploadDocument);
router.delete('/:id/document/:documentId', validate(deleteDocumentSchema), paperworkAdminController.deleteDocument);
router.put('/:id/status', validate(updateStatusSchema), paperworkAdminController.updatePaperworkStatus);

export default router;
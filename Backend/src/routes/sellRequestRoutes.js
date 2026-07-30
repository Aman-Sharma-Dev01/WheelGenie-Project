import express from 'express';
import * as sellRequestController from '../controllers/sellRequestController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const createSellRequestSchema = z.object({
  body: z.object({
    brand: z.string({ required_error: 'Brand is required' }).trim().min(1),
    model: z.string({ required_error: 'Model is required' }).trim().min(1),
    variant: z.string({ required_error: 'Variant is required' }).trim().min(1),
    fuel: z.enum(['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'], { required_error: 'Fuel type is required' }),
    transmission: z.enum(['Manual', 'Automatic'], { required_error: 'Transmission type is required' }),
    kms: z.number({ required_error: 'Kilometers run is required' }).min(0),
    year: z.number({ required_error: 'Manufacturing year is required' }).min(1901).max(new Date().getFullYear() + 1),
    ownership: z.number({ required_error: 'Ownership number is required' }).min(1),
    city: z.string({ required_error: 'City is required' }).trim().min(1),
    expectedPrice: z.number().min(0).optional(),
    description: z.string().optional(),
    images: z.array(z.object({
      url: z.string(),
      publicId: z.string().optional()
    })).optional()
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
    description: z.string().optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID')
  })
});

const addImagesSchema = z.object({
  body: z.object({
    images: z.array(z.object({
      url: z.string({ required_error: 'Image URL is required' }),
      publicId: z.string().optional()
    })).min(1, 'At least one image is required')
  }),
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID')
  })
});

const addDocumentsSchema = z.object({
  body: z.object({
    documents: z.array(z.object({
      name: z.string({ required_error: 'Document name is required' }),
      type: z.enum(['RC', 'Insurance', 'PUC', 'ServiceHistory', 'Other'], { required_error: 'Document type is required' }),
      url: z.string({ required_error: 'Document URL is required' }),
      publicId: z.string().optional()
    })).min(1, 'At least one document is required')
  }),
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID')
  })
});

const idParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID')
  })
});

const imageIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID'),
    imageId: z.string({ required_error: 'Image ID is required' })
  })
});

const documentIdParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }).length(24, 'Invalid sell request ID'),
    documentId: z.string({ required_error: 'Document ID is required' })
  })
});

const mySellRequestsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
    status: z.enum(['pending', 'inspection_scheduled', 'inspection_completed', 'approved', 'rejected', 'listed', 'cancelled']).optional()
  })
});

const router = express.Router();

router.use(protect);

router.post('/', validate(createSellRequestSchema), sellRequestController.createSellRequest);
router.get('/my', validate(mySellRequestsSchema), sellRequestController.getMySellRequests);
router.get('/:id', validate(idParamSchema), sellRequestController.getSellRequestById);
router.put('/:id', validate(updateSellRequestSchema), sellRequestController.updateSellRequest);
router.delete('/:id', validate(idParamSchema), sellRequestController.deleteSellRequest);
router.post('/:id/images', validate(addImagesSchema), sellRequestController.addImages);
router.delete('/:id/images/:imageId', validate(imageIdParamSchema), sellRequestController.deleteImage);
router.post('/:id/documents', validate(addDocumentsSchema), sellRequestController.addDocuments);
router.delete('/:id/documents/:documentId', validate(documentIdParamSchema), sellRequestController.deleteDocument);
router.post('/:id/cancel', validate(idParamSchema), sellRequestController.cancelSellRequest);

export default router;
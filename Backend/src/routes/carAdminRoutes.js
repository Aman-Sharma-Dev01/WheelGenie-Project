import express from 'express';
import * as carAdminController from '../controllers/carAdminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const carIdSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Car ID is required' }).length(24, 'Invalid car ID')
  })
});

const createCarSchema = z.object({
  body: z.object({
    brand: z.string({ required_error: 'Brand is required' }).trim().min(1),
    model: z.string({ required_error: 'Model is required' }).trim().min(1),
    variant: z.string({ required_error: 'Variant is required' }).trim().min(1),
    fuel: z.enum(['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'], { required_error: 'Fuel type is required' }),
    transmission: z.enum(['Manual', 'Automatic'], { required_error: 'Transmission type is required' }),
    kms: z.number({ required_error: 'Kilometers is required' }).min(0),
    year: z.number({ required_error: 'Year is required' }).min(1900).max(new Date().getFullYear() + 1),
    ownership: z.number({ required_error: 'Ownership is required' }).min(1),
    city: z.string({ required_error: 'City is required' }).trim().min(1),
    images: z.array(z.object({
      url: z.string({ required_error: 'Image URL is required' }),
      publicId: z.string().optional()
    })).optional(),
    listingPrice: z.number().min(0).optional(),
    listingDescription: z.string().optional(),
    sellRequestId: z.string().length(24, 'Invalid sell request ID').optional()
  })
});

const updateCarSchema = z.object({
  body: z.object({
    brand: z.string().trim().min(1).optional(),
    model: z.string().trim().min(1).optional(),
    variant: z.string().trim().min(1).optional(),
    fuel: z.enum(['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']).optional(),
    transmission: z.enum(['Manual', 'Automatic']).optional(),
    kms: z.number().min(0).optional(),
    year: z.number().min(1900).max(new Date().getFullYear() + 1).optional(),
    ownership: z.number().min(1).optional(),
    city: z.string().trim().min(1).optional(),
    images: z.array(z.object({
      url: z.string({ required_error: 'Image URL is required' }),
      publicId: z.string().optional()
    })).optional(),
    status: z.enum(['active', 'sold', 'paused', 'draft', 'archived', 'reserved']).optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Car ID is required' }).length(24, 'Invalid car ID')
  })
});

const getAdminCarsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    status: z.enum(['active', 'sold', 'paused', 'draft', 'archived', 'reserved']).optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    search: z.string().optional()
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
    id: z.string({ required_error: 'Car ID is required' }).length(24, 'Invalid car ID')
  })
});

const deleteImageSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Car ID is required' }).length(24, 'Invalid car ID'),
    imageId: z.string({ required_error: 'Image ID is required' })
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
    id: z.string({ required_error: 'Car ID is required' }).length(24, 'Invalid car ID')
  })
});

const deleteDocumentSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Car ID is required' }).length(24, 'Invalid car ID'),
    documentId: z.string({ required_error: 'Document ID is required' })
  })
});

const router = express.Router();

router.use(protect);
router.use(restrictTo('official', 'admin'));

router.post('/', validate(createCarSchema), carAdminController.createCar);
router.get('/', validate(getAdminCarsSchema), carAdminController.getAdminCars);
router.get('/:id', validate(carIdSchema), carAdminController.getCarByIdAdmin);
router.put('/:id', validate(updateCarSchema), carAdminController.updateCar);
router.delete('/:id', validate(carIdSchema), carAdminController.deleteCar);
router.put('/:id/publish', validate(carIdSchema), carAdminController.publishCar);
router.put('/:id/private', validate(carIdSchema), carAdminController.makeCarPrivate);
router.put('/:id/archive', validate(carIdSchema), carAdminController.archiveCar);
router.put('/:id/sold', validate(carIdSchema), carAdminController.markCarSold);
router.put('/:id/reserved', validate(carIdSchema), carAdminController.markCarReserved);
router.put('/:id/unsold', validate(carIdSchema), carAdminController.markCarUnsold);
router.post('/:id/images', validate(addImagesSchema), carAdminController.addCarImages);
router.delete('/:id/images/:imageId', validate(deleteImageSchema), carAdminController.deleteCarImage);
router.post('/:id/documents', validate(addDocumentsSchema), carAdminController.addCarDocuments);
router.delete('/:id/documents/:documentId', validate(deleteDocumentSchema), carAdminController.deleteCarDocument);

export default router;
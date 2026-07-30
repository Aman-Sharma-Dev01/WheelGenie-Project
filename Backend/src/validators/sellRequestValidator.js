import { z } from 'zod';

export const createSellRequestSchema = z.object({
  body: z.object({
    brand: z.string({ required_error: 'Brand is required' }).trim().min(1),
    model: z.string({ required_error: 'Model is required' }).trim().min(1),
    variant: z.string({ required_error: 'Variant is required' }).trim().min(1),
    fuel: z.enum(['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'], { required_error: 'Fuel type is required' }),
    transmission: z.enum(['Manual', 'Automatic'], { required_error: 'Transmission type is required' }),
    kms: z.number({ required_error: 'Kilometers is required' }).min(0),
    year: z.number({ required_error: 'Year is required' }).min(1901).max(new Date().getFullYear() + 1),
    ownership: z.number({ required_error: 'Ownership is required' }).min(1),
    city: z.string({ required_error: 'City is required' }).trim().min(1),
    expectedPrice: z.number().min(0).optional(),
    description: z.string().trim().optional(),
    images: z.array(z.object({
      url: z.string().url(),
      publicId: z.string().optional()
    })).optional()
  })
});

export const updateSellRequestSchema = z.object({
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
    description: z.string().trim().optional()
  })
});

export const sellRequestIdSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' })
  })
});

export const imageIdSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }),
    imageId: z.string({ required_error: 'Image ID is required' })
  })
});

export const documentIdSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Sell request ID is required' }),
    documentId: z.string({ required_error: 'Document ID is required' })
  })
});

export const addImagesSchema = z.object({
  body: z.object({
    images: z.array(z.object({
      url: z.string().url(),
      publicId: z.string().optional()
    }), { required_error: 'Images array is required' }).min(1)
  })
});

export const addDocumentsSchema = z.object({
  body: z.object({
    documents: z.array(z.object({
      name: z.string({ required_error: 'Document name is required' }).trim().min(1),
      type: z.enum(['RC', 'Insurance', 'PUC', 'ServiceHistory', 'Other'], { required_error: 'Document type is required' }),
      url: z.string().url({ required_error: 'Document URL is required' }),
      publicId: z.string().optional()
    }), { required_error: 'Documents array is required' }).min(1)
  })
});

export const getMySellRequestsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(10).optional(),
    status: z.enum(['pending', 'inspection_scheduled', 'inspection_completed', 'approved', 'rejected', 'listed', 'cancelled']).optional()
  })
});
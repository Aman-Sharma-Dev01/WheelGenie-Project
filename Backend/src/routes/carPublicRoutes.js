import express from 'express';
import * as carPublicController from '../controllers/carPublicController.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Car ID is required' }).length(24, 'Invalid car ID')
  })
});

const getCarsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).default(12).optional(),
    brand: z.string().optional(),
    model: z.string().optional(),
    fuel: z.enum(['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid']).optional(),
    transmission: z.enum(['Manual', 'Automatic']).optional(),
    city: z.string().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    minYear: z.coerce.number().min(1900).optional(),
    maxYear: z.coerce.number().max(new Date().getFullYear() + 1).optional(),
    minKms: z.coerce.number().min(0).optional(),
    maxKms: z.coerce.number().optional(),
    sort: z.string().default('-createdAt').optional(),
    search: z.string().optional()
  })
});

const featuredSchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(20).default(6).optional()
  })
});

const latestSchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(50).default(10).optional()
  })
});

const searchSchema = z.object({
  query: z.object({
    q: z.string({ required_error: 'Search query is required' }).min(1),
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).default(12).optional()
  })
});

const filterSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(50).default(12).optional(),
    brands: z.string().optional(),
    fuels: z.string().optional(),
    transmissions: z.string().optional(),
    cities: z.string().optional(),
    minPrice: z.coerce.number().min(0).optional(),
    maxPrice: z.coerce.number().min(0).optional(),
    minYear: z.coerce.number().min(1900).optional(),
    maxYear: z.coerce.number().max(new Date().getFullYear() + 1).optional(),
    minKms: z.coerce.number().min(0).optional(),
    maxKms: z.coerce.number().optional(),
    sort: z.string().default('-createdAt').optional()
  })
});

const relatedSchema = z.object({
  query: z.object({
    limit: z.coerce.number().int().min(1).max(20).default(4).optional()
  }),
  params: z.object({
    id: z.string({ required_error: 'Car ID is required' }).length(24, 'Invalid car ID')
  })
});

const router = express.Router();

router.get('/', validate(getCarsSchema), carPublicController.getCars);
router.get('/featured', validate(featuredSchema), carPublicController.getFeaturedCars);
router.get('/latest', validate(latestSchema), carPublicController.getLatestCars);
router.get('/search', validate(searchSchema), carPublicController.searchCars);
router.get('/filter', validate(filterSchema), carPublicController.filterCars);
router.get('/related/:id', validate(relatedSchema), carPublicController.getRelatedCars);
router.get('/:id', validate(idParamSchema), carPublicController.getCarById);

export default router;
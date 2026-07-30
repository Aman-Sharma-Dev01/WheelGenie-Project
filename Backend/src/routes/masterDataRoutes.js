import express from 'express';
import * as masterDataController from '../controllers/masterDataController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'ID is required' }).length(24, 'Invalid ID')
  })
});

const brandSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Brand name is required' }).min(1).max(100),
    logo: z.string().url('Invalid logo URL').optional(),
    isActive: z.boolean().default(true).optional(),
    displayOrder: z.number().int().min(0).default(0).optional()
  })
});

const modelSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Model name is required' }).min(1).max(100),
    brand: z.string({ required_error: 'Brand ID is required' }).length(24, 'Invalid brand ID'),
    bodyType: z.enum(['sedan', 'hatchback', 'suv', 'muv', 'coupe', 'convertible', 'wagon', 'pickup', 'van', 'other']).optional(),
    isActive: z.boolean().default(true).optional(),
    displayOrder: z.number().int().min(0).default(0).optional()
  })
});

const stateSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'State name is required' }).min(1).max(100),
    code: z.string({ required_error: 'State code is required' }).length(2, 'State code must be 2 characters').toUpperCase(),
    isActive: z.boolean().default(true).optional()
  })
});

const citySchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'City name is required' }).min(1).max(100),
    state: z.string({ required_error: 'State ID is required' }).length(24, 'Invalid state ID'),
    coordinates: z.object({
      type: z.literal('Point').default('Point'),
      coordinates: z.array(z.number()).length(2, 'Coordinates must be [longitude, latitude]')
    }).optional(),
    isActive: z.boolean().default(true).optional()
  })
});

const getBrandsSchema = z.object({
  query: z.object({
    active: z.enum(['true', 'false']).default('true').optional(),
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(50).optional()
  })
});

const getModelsSchema = z.object({
  query: z.object({
    brand: z.string().length(24, 'Invalid brand ID').optional(),
    active: z.enum(['true', 'false']).default('true').optional(),
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(50).optional()
  })
});

const getStatesSchema = z.object({
  query: z.object({
    active: z.enum(['true', 'false']).default('true').optional(),
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(50).optional()
  })
});

const getCitiesSchema = z.object({
  query: z.object({
    state: z.string().length(24, 'Invalid state ID').optional(),
    active: z.enum(['true', 'false']).default('true').optional(),
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(50).optional(),
    search: z.string().optional()
  })
});

const cityByStateSchema = z.object({
  params: z.object({
    stateId: z.string({ required_error: 'State ID is required' }).length(24, 'Invalid state ID')
  }),
  query: z.object({
    active: z.enum(['true', 'false']).default('true').optional()
  })
});

const router = express.Router();

router.use(protect);

// Brands
router.get('/brands', validate(getBrandsSchema), masterDataController.getBrands);
router.get('/brands/:id', validate(idParamSchema), masterDataController.getBrandById);
router.post('/brands', restrictTo('official', 'admin'), validate(brandSchema), masterDataController.createBrand);
router.put('/brands/:id', restrictTo('official', 'admin'), validate(idParamSchema.merge(brandSchema)), masterDataController.updateBrand);
router.delete('/brands/:id', restrictTo('official', 'admin'), validate(idParamSchema), masterDataController.deleteBrand);

// Models
router.get('/models', validate(getModelsSchema), masterDataController.getModels);
router.get('/models/:id', validate(idParamSchema), masterDataController.getModelById);
router.post('/models', restrictTo('official', 'admin'), validate(modelSchema), masterDataController.createModel);
router.put('/models/:id', restrictTo('official', 'admin'), validate(idParamSchema.merge(modelSchema)), masterDataController.updateModel);
router.delete('/models/:id', restrictTo('official', 'admin'), validate(idParamSchema), masterDataController.deleteModel);

// States
router.get('/states', validate(getStatesSchema), masterDataController.getStates);
router.get('/states/:id', validate(idParamSchema), masterDataController.getStateById);
router.post('/states', restrictTo('official', 'admin'), validate(stateSchema), masterDataController.createState);
router.put('/states/:id', restrictTo('official', 'admin'), validate(idParamSchema.merge(stateSchema)), masterDataController.updateState);
router.delete('/states/:id', restrictTo('official', 'admin'), validate(idParamSchema), masterDataController.deleteState);

// Cities
router.get('/cities', validate(getCitiesSchema), masterDataController.getCities);
router.get('/cities/:id', validate(idParamSchema), masterDataController.getCityById);
router.post('/cities', restrictTo('official', 'admin'), validate(citySchema), masterDataController.createCity);
router.put('/cities/:id', restrictTo('official', 'admin'), validate(idParamSchema.merge(citySchema)), masterDataController.updateCity);
router.delete('/cities/:id', restrictTo('official', 'admin'), validate(idParamSchema), masterDataController.deleteCity);
router.get('/states/:stateId/cities', validate(cityByStateSchema), masterDataController.getCitiesByState);

export default router;
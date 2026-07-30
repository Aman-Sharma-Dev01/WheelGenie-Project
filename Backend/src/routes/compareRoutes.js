import express from 'express';
import * as compareController from '../controllers/compareController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const addToCompareSchema = z.object({
  body: z.object({
    carId: z.string({ required_error: 'Car ID is required' }).length(24, 'Invalid car ID')
  })
});

const carIdParamSchema = z.object({
  params: z.object({
    carId: z.string({ required_error: 'Car ID is required' }).length(24, 'Invalid car ID')
  })
});

const router = express.Router();

router.use(protect);

router.get('/', compareController.getCompare);
router.post('/', validate(addToCompareSchema), compareController.addToCompare);
router.delete('/:carId', validate(carIdParamSchema), compareController.removeFromCompare);

export default router;
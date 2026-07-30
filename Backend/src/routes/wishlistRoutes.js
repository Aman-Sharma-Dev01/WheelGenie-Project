import express from 'express';
import * as wishlistController from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const carIdParamSchema = z.object({
  params: z.object({
    carId: z.string({ required_error: 'Car ID is required' }).length(24, 'Invalid car ID')
  })
});

const router = express.Router();

router.use(protect);

router.get('/', wishlistController.getWishlist);
router.post('/:carId', validate(carIdParamSchema), wishlistController.addToWishlist);
router.delete('/:carId', validate(carIdParamSchema), wishlistController.removeFromWishlist);

export default router;
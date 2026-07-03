import express from 'express';
import * as valuationController from '../controllers/valuationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { valuationSchema } from '../validators/aiValidator.js';

const router = express.Router();

router.post('/', protect, validate(valuationSchema), valuationController.getValuation);

export default router;

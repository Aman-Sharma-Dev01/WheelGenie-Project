import express from 'express';
import * as aiController from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { evaluateVehicleSchema } from '../validators/aiValidator.js';

const router = express.Router();

// All AI routes are protected
router.use(protect);

router.post('/evaluate', validate(evaluateVehicleSchema), aiController.evaluateVehicle);
router.get('/evaluations', aiController.getMyEvaluations);
router.get('/evaluations/:id', aiController.getEvaluationById);

export default router;

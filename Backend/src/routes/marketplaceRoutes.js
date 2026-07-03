import express from 'express';
import * as marketplaceController from '../controllers/marketplaceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import {
  createVehicleSchema,
  updateVehicleSchema,
  queryListingSchema
} from '../validators/marketplaceValidator.js';

const router = express.Router();

// Public Endpoints
router.get('/', validate(queryListingSchema), marketplaceController.getAllListings);
router.get('/:id', marketplaceController.getListingDetails);

// Protected Endpoints
router.post('/', protect, validate(createVehicleSchema), marketplaceController.createVehicleListing);
router.patch('/:id', protect, validate(updateVehicleSchema), marketplaceController.updateVehicleListing);
router.delete('/:id', protect, marketplaceController.deleteVehicleListing);

export default router;

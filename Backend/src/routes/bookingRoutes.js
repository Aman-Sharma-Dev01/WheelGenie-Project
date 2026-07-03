import express from 'express';
import * as bookingController from '../controllers/bookingController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import {
  createBookingSchema,
  updateBookingStatusSchema,
  mechanicQuerySchema
} from '../validators/bookingValidator.js';

const router = express.Router();

// Public Mechanic Endpoints
router.get('/mechanics', validate(mechanicQuerySchema), bookingController.getAllMechanics);
router.get('/mechanics/:id', bookingController.getMechanicById);

// Protected Booking Endpoints
router.post('/bookings', protect, validate(createBookingSchema), bookingController.createBooking);
router.get('/bookings/my', protect, bookingController.getMyBookings);
router.get('/bookings/:id', protect, bookingController.getBookingById);
router.patch('/bookings/:id/status', protect, validate(updateBookingStatusSchema), bookingController.updateBookingStatus);

export default router;

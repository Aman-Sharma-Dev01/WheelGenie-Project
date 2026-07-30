import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const idParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Notification ID is required' }).length(24, 'Invalid notification ID')
  })
});

const getNotificationsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    unreadOnly: z.enum(['true', 'false']).default('false').optional(),
    type: z.enum(['Booking', 'Service', 'System', 'Promotion']).optional()
  })
});

const router = express.Router();

router.use(protect);

router.get('/', validate(getNotificationsSchema), notificationController.getNotifications);
router.get('/:id', validate(idParamSchema), notificationController.getNotificationById);
router.put('/read/:id', validate(idParamSchema), notificationController.markNotificationRead);
router.put('/read-all', notificationController.markAllNotificationsRead);
router.delete('/:id', validate(idParamSchema), notificationController.deleteNotification);

export default router;
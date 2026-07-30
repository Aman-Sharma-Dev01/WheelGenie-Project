import express from 'express';
import * as clientController from '../controllers/clientController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const getNotificationsSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    unreadOnly: z.enum(['true', 'false']).default('false').optional()
  })
});

const notificationIdSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'Notification ID is required' }).length(24, 'Invalid notification ID')
  })
});

const router = express.Router();

router.use(protect);

router.get('/dashboard', clientController.getDashboard);
router.get('/notifications', validate(getNotificationsSchema), clientController.getNotifications);
router.put('/notification/read/:id', validate(notificationIdSchema), clientController.markNotificationRead);
router.put('/notification/read-all', clientController.markAllNotificationsRead);

export default router;
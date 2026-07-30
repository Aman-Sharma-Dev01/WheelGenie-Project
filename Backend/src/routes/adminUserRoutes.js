import express from 'express';
import * as adminUserController from '../controllers/adminUserController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';
import { validate } from '../validators/authValidator.js';
import { z } from 'zod';

const router = express.Router();

router.use(protect);
router.use(restrictTo('admin', 'official'));

const idParamSchema = z.object({
  params: z.object({
    id: z.string({ required_error: 'User ID is required' }).length(24, 'Invalid user ID')
  })
});

const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    phone: z.string().min(10).max(15).optional(),
    address: z.object({
      street: z.string().optional(),
      city: z.string().optional(),
      state: z.string().optional(),
      zipCode: z.string().optional()
    }).optional(),
    profilePic: z.string().url().optional(),
    role: z.enum(['customer', 'official', 'admin']).optional(),
    isVerified: z.boolean().optional()
  })
});

const getUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).default(20).optional(),
    role: z.enum(['customer', 'official', 'admin']).optional(),
    search: z.string().optional(),
    isBlocked: z.enum(['true', 'false']).optional()
  })
});

router.get('/', validate(getUsersSchema), adminUserController.getAllUsers);
router.get('/:id', validate(idParamSchema), adminUserController.getUserById);
router.put('/:id', validate(idParamSchema.merge(updateUserSchema)), adminUserController.updateUser);
router.put('/:id/block', validate(idParamSchema), adminUserController.blockUser);
router.put('/:id/unblock', validate(idParamSchema), adminUserController.unblockUser);
router.delete('/:id', validate(idParamSchema), adminUserController.deleteUser);

export default router;
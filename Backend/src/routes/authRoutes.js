import express from 'express';
import * as authController from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validate,
  registerSchema,
  loginSchema,
  updateProfileSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleLoginSchema
} from '../validators/authValidator.js';

const router = express.Router();

// Public Auth Endpoints
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/logout', authController.logout);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.patch('/reset-password/:token', validate(resetPasswordSchema), authController.resetPassword);
router.post('/google-login', validate(googleLoginSchema), authController.googleLogin);

// Protected Auth Endpoints
router.use(protect);
router.get('/me', authController.getMe);
router.patch('/profile', validate(updateProfileSchema), authController.updateProfile);

export default router;

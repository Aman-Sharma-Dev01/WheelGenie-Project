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
  googleLoginSchema,
  refreshTokenSchema,
  sendOtpSchema,
  verifyOtpSchema,
  updateLocationSchema,
  deleteAccountSchema
} from '../validators/authValidator.js';

const router = express.Router();

// Public Auth Endpoints
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', validate(refreshTokenSchema), authController.refreshToken);
router.post('/forgot-password', validate(forgotPasswordSchema), authController.forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
router.post('/send-otp', validate(sendOtpSchema), authController.sendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOtp);
router.post('/logout', authController.logout);
router.post('/google-login', validate(googleLoginSchema), authController.googleLogin);

// Protected Auth Endpoints
router.use(protect);
router.get('/me', authController.getMe);
router.put('/update-profile', validate(updateProfileSchema), authController.updateProfile);
router.put('/update-location', validate(updateLocationSchema), authController.updateLocation);
router.delete('/delete-account', validate(deleteAccountSchema), authController.deleteAccount);

export default router;

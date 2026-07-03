import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// JWT Sign Helpers
const signAccessToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
};

const signRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  });
};

// Send Tokens in Cookie and Response
const createSendToken = async (user, statusCode, res, message = 'Success') => {
  const accessToken = signAccessToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  // Update refresh token in user document
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  // Remove password and refreshToken from response output
  user.password = undefined;
  user.refreshToken = undefined;

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax'
  };

  // Set cookies
  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });

  res.status(statusCode).json({
    success: true,
    statusCode,
    message,
    data: {
      user,
      accessToken
    }
  });
};

// 1. REGISTER
export const register = catchAsync(async (req, res, next) => {
  const { name, email, password, phone, role, address, profilePic } = req.body;

  // Check if email already registered
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email address is already in use.', 400));
  }

  const newUser = await User.create({
    name,
    email,
    password,
    phone,
    role,
    address,
    profilePic
  });

  await createSendToken(newUser, 201, res, 'User registered successfully');
});

// 2. LOGIN
export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // Get user with password field explicitly selected
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  await createSendToken(user, 200, res, 'Logged in successfully');
});

// 3. LOGOUT
export const logout = catchAsync(async (req, res, next) => {
  // If user is logged in, clear their stored refresh token in DB
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      await User.findByIdAndUpdate(decoded.id, { $unset: { refreshToken: 1 } });
    } catch (err) {
      // Ignore token verification errors during logout
    }
  }

  // Clear cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Logged out successfully'
  });
});

// 4. GET ME
export const getMe = catchAsync(async (req, res, next) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'User profile retrieved successfully',
    data: {
      user: req.user
    }
  });
});

// 5. PATCH PROFILE
export const updateProfile = catchAsync(async (req, res, next) => {
  const { name, phone, address, profilePic } = req.body;

  // Prevent updates to password, email, role here
  const updateData = {};
  if (name) updateData.name = name;
  if (phone) updateData.phone = phone;
  if (address) updateData.address = address;
  if (profilePic) updateData.profilePic = profilePic;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Profile updated successfully',
    data: {
      user: updatedUser
    }
  });
});

// 6. FORGOT PASSWORD
export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('There is no user with that email address.', 404));
  }

  // Generate plain reset token
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash reset token and save to database
  user.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

  await user.save({ validateBeforeSave: false });

  // For testing/mocking since mail service is not configured
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/auth/reset-password/${resetToken}`;
  console.log(`[MOCK EMAIL SENT] Reset password link: ${resetURL}`);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Password reset link generated successfully.',
    data: {
      resetURL: process.env.NODE_ENV === 'development' ? resetURL : undefined,
      note: 'In production, check your email inbox.'
    }
  });
});

// 7. RESET PASSWORD
export const resetPassword = catchAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  // Hash plain token from param to compare with hashed value in DB
  const hashedToken = crypto
    .createHash('sha256')
    .update(token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired.', 400));
  }

  // Set new password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  await createSendToken(user, 200, res, 'Password reset successfully');
});

// 8. GOOGLE LOGIN
// Decodes payload for local client simulation / OAuth token logic
export const googleLogin = catchAsync(async (req, res, next) => {
  const { token } = req.body;

  let decoded;
  try {
    // Decoding payload (simulating auth verification)
    decoded = jwt.decode(token);
    if (!decoded || !decoded.email) {
      return next(new AppError('Invalid Google credential token format.', 400));
    }
  } catch (err) {
    return next(new AppError('Failed to parse Google OAuth token.', 400));
  }

  const { email, name, picture } = decoded;

  let user = await User.findOne({ email });
  if (!user) {
    // Auto-register google user as customer
    user = await User.create({
      name: name || 'Google User',
      email,
      password: crypto.randomBytes(16).toString('hex'), // dummy random password
      phone: '0000000000', // placeholder
      role: 'customer',
      profilePic: picture || ''
    });
  }

  await createSendToken(user, 200, res, 'Logged in via Google successfully');
});

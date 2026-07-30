import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

export const getAllUsers = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, role, search, isBlocked } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (role) filter.role = role;
  if (isBlocked === 'true') filter.isBlocked = true;
  if (isBlocked === 'false') filter.isBlocked = false;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password -refreshToken -passwordResetToken -passwordResetExpires -otp -otpExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    User.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Users retrieved successfully',
    data: {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id)
    .select('-password -refreshToken -passwordResetToken -passwordResetExpires -otp -otpExpires')
    .lean();

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'User retrieved successfully',
    data: { user }
  });
});

export const updateUser = catchAsync(async (req, res, next) => {
  const allowedUpdates = ['name', 'phone', 'address', 'profilePic', 'role', 'isVerified'];
  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) updates[key] = req.body[key];
  });

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  ).select('-password -refreshToken -passwordResetToken -passwordResetExpires -otp -otpExpires');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'User updated successfully',
    data: { user }
  });
});

export const blockUser = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { 
      isBlocked: true, 
      blockedReason: reason || 'Blocked by admin', 
      blockedAt: new Date() 
    },
    { new: true }
  ).select('-password -refreshToken -passwordResetToken -passwordResetExpires -otp -otpExpires');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  await Notification.create({
    recipient: user._id,
    title: 'Account Blocked',
    message: `Your account has been blocked. Reason: ${reason || 'No reason provided'}`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'User blocked successfully',
    data: { user }
  });
});

export const unblockUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { 
      isBlocked: false, 
      blockedReason: null, 
      blockedAt: null 
    },
    { new: true }
  ).select('-password -refreshToken -passwordResetToken -passwordResetExpires -otp -otpExpires');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  await Notification.create({
    recipient: user._id,
    title: 'Account Unblocked',
    message: 'Your account has been unblocked. You can now access all features.',
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'User unblocked successfully',
    data: { user }
  });
});

export const deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'User deleted successfully'
  });
});
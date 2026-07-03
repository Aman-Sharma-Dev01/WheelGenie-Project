import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

export const protect = catchAsync(async (req, res, next) => {
  let token;

  // 1) Check for JWT in headers or cookies
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', 401));
  }

  // 2) Verify token (JsonWebTokenError & TokenExpiredError handled in errorHandler)
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', 401));
  }

  // 4) Grant access to protected route
  req.user = currentUser;
  next();
});

// Role authorization guard
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};

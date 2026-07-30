import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Notification from '../models/Notification.js';

export const getNotifications = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, unreadOnly = 'false', type } = req.query;
  const skip = (page - 1) * limit;

  const filter = { recipient: req.user._id };
  if (unreadOnly === 'true') filter.isRead = false;
  if (type) filter.type = type;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Notification.countDocuments(filter),
    Notification.countDocuments({ recipient: req.user._id, isRead: false })
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Notifications retrieved successfully',
    data: {
      notifications,
      unreadCount,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const getNotificationById = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id
  }).lean();

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Notification retrieved successfully',
    data: { notification }
  });
});

export const markNotificationRead = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, recipient: req.user._id },
    { isRead: true },
    { new: true }
  ).lean();

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Notification marked as read',
    data: { notification }
  });
});

export const markAllNotificationsRead = catchAsync(async (req, res, next) => {
  await Notification.updateMany(
    { recipient: req.user._id, isRead: false },
    { isRead: true }
  );

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'All notifications marked as read'
  });
});

export const deleteNotification = catchAsync(async (req, res, next) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user._id
  });

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Notification deleted successfully'
  });
});
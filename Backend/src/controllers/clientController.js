import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Notification from '../models/Notification.js';
import Vehicle from '../models/Vehicle.js';
import Listing from '../models/Listing.js';
import Booking from '../models/Booking.js';

export const getDashboard = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const [
    sellRequests,
    activeListings,
    testDrives,
    inquiries,
    unreadNotifications
  ] = await Promise.all([
    Vehicle.find({ owner: userId })
      .select('brand model variant year status createdAt')
      .sort({ createdAt: -1 })
      .lean(),
    Listing.find()
      .populate({
        path: 'vehicle',
        match: { owner: userId },
        select: 'brand model variant year images status'
      })
      .populate('seller', 'name email phone')
      .lean(),
    Booking.find({ customer: userId, type: 'testDrive' })
      .populate({
        path: 'vehicle',
        populate: { path: 'vehicle', select: 'brand model variant images' }
      })
      .populate('mechanic', 'name phone')
      .sort({ date: -1 })
      .lean(),
    Notification.find({ recipient: userId, type: 'Inquiry' })
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Notification.countDocuments({ recipient: userId, isRead: false })
  ]);

  const activeListingsFiltered = activeListings.filter(l => l.vehicle).map(l => ({
    listingId: l._id,
    vehicle: l.vehicle,
    price: l.price,
    status: l.status,
    views: l.views,
    createdAt: l.createdAt
  }));

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Dashboard retrieved successfully',
    data: {
      sellRequests: sellRequests.map(v => ({
        vehicleId: v._id,
        brand: v.brand,
        model: v.model,
        variant: v.variant,
        year: v.year,
        status: v.status,
        createdAt: v.createdAt
      })),
      activeListings: activeListingsFiltered,
      upcomingTestDrives: testDrives,
      recentInquiries: inquiries,
      unreadNotificationsCount: unreadNotifications
    }
  });
});

export const getNotifications = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, unreadOnly = 'false' } = req.query;
  const skip = (page - 1) * limit;

  const filter = { recipient: req.user._id };
  if (unreadOnly === 'true') filter.isRead = false;

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Notification.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Notifications retrieved successfully',
    data: {
      notifications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const markNotificationRead = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const notification = await Notification.findOneAndUpdate(
    { _id: id, recipient: req.user._id },
    { isRead: true },
    { new: true }
  );

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
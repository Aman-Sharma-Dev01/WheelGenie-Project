import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import SellRequest from '../models/SellRequest.js';
import Deal from '../models/Deal.js';
import TestDrive from '../models/TestDrive.js';
import Inquiry from '../models/Inquiry.js';
import Notification from '../models/Notification.js';
import Vehicle from '../models/Vehicle.js';
import Listing from '../models/Listing.js';
import Meeting from '../models/Meeting.js';

export const getClientDashboard = catchAsync(async (req, res, next) => {
  const userId = req.user._id;

  const [
    sellRequests,
    activeDeals,
    upcomingTestDrives,
    pendingInquiries,
    unreadNotifications,
    recentActivity
  ] = await Promise.all([
    SellRequest.find({ client: userId })
      .select('brand model variant year status createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean(),
    Deal.find({ client: userId, status: { $nin: ['completed', 'cancelled'] } })
      .populate('car', 'brand model variant year images')
      .populate('official', 'name email phone')
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean(),
    TestDrive.find({ client: userId, status: { $in: ['requested', 'approved', 'scheduled', 'rescheduled'] } })
      .populate('car', 'brand model variant year images')
      .populate('official', 'name email phone')
      .sort({ scheduledDate: 1 })
      .limit(5)
      .lean(),
    Inquiry.find({ client: userId, status: { $ne: 'closed' } })
      .populate('car', 'brand model variant year images')
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean(),
    Notification.countDocuments({ recipient: userId, isRead: false }),
    Promise.all([
      SellRequest.find({ client: userId }).sort({ createdAt: -1 }).limit(3).lean(),
      Deal.find({ client: userId }).sort({ createdAt: -1 }).limit(3).lean(),
      TestDrive.find({ client: userId }).sort({ createdAt: -1 }).limit(3).lean()
    ])
  ]);

  const stats = {
    totalSellRequests: await SellRequest.countDocuments({ client: userId }),
    activeSellRequests: await SellRequest.countDocuments({ 
      client: userId, 
      status: { $nin: ['cancelled', 'listed', 'rejected'] } 
    }),
    totalDeals: await Deal.countDocuments({ client: userId }),
    activeDeals: await Deal.countDocuments({ 
      client: userId, 
      status: { $nin: ['completed', 'cancelled'] } 
    }),
    completedDeals: await Deal.countDocuments({ client: userId, status: 'completed' }),
    upcomingTestDrives: await TestDrive.countDocuments({ 
      client: userId, 
      status: { $in: ['requested', 'approved', 'scheduled', 'rescheduled'] },
      scheduledDate: { $gte: new Date() }
    }),
    pendingInquiries: await Inquiry.countDocuments({ client: userId, status: { $ne: 'closed' } }),
    unreadNotifications
  };

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Client dashboard retrieved successfully',
    data: {
      stats,
      sellRequests,
      activeDeals,
      upcomingTestDrives,
      pendingInquiries,
      recentActivity: {
        sellRequests: recentActivity[0],
        deals: recentActivity[1],
        testDrives: recentActivity[2]
      }
    }
  });
});

export const getAdminDashboard = catchAsync(async (req, res, next) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    pendingSellRequests,
    scheduledInspections,
    activeDeals,
    pendingInquiries,
    upcomingMeetings,
    stats
  ] = await Promise.all([
    SellRequest.find({ status: 'pending' })
      .populate('client', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean(),
    Meeting.find({ 
      status: { $in: ['scheduled', 'confirmed'] },
      scheduledDate: { $gte: today, $lt: tomorrow }
    })
      .populate('sellRequest', 'brand model variant')
      .populate('client', 'name email phone')
      .populate('official', 'name email')
      .sort({ scheduledDate: 1 })
      .limit(10)
      .lean(),
    Deal.find({ status: { $in: ['draft', 'pending_payment', 'payment_received', 'documents_pending'] } })
      .populate('car', 'brand model variant year images')
      .populate('client', 'name email phone')
      .populate('official', 'name email')
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean(),
    Inquiry.find({ status: { $in: ['open', 'in_progress'] } })
      .populate('car', 'brand model variant year images')
      .populate('client', 'name email phone')
      .sort({ updatedAt: -1 })
      .limit(5)
      .lean(),
    Meeting.find({ 
      status: { $in: ['scheduled', 'confirmed'] },
      scheduledDate: { $gte: today }
    })
      .populate('sellRequest', 'brand model variant')
      .populate('client', 'name email phone')
      .populate('official', 'name email')
      .sort({ scheduledDate: 1 })
      .limit(10)
      .lean(),
    Promise.all([
      SellRequest.countDocuments({ status: 'pending' }),
      SellRequest.countDocuments({ status: 'inspection_scheduled' }),
      Deal.countDocuments({ status: { $in: ['draft', 'pending_payment', 'payment_received', 'documents_pending'] } }),
      Inquiry.countDocuments({ status: { $in: ['open', 'in_progress'] } }),
      Meeting.countDocuments({ status: { $in: ['scheduled', 'confirmed'] }, scheduledDate: { $gte: today } }),
      Vehicle.countDocuments({ status: 'active' }),
      Deal.countDocuments({ status: 'completed', completedAt: { $gte: today } })
    ])
  ]);

  const [pendingCount, inspectionCount, activeDealsCount, inquiryCount, meetingCount, activeListings, dealsToday] = stats;

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Admin dashboard retrieved successfully',
    data: {
      stats: {
        pendingSellRequests: pendingCount,
        scheduledInspections: inspectionCount,
        activeDeals: activeDealsCount,
        pendingInquiries: inquiryCount,
        upcomingMeetings: meetingCount,
        activeListings,
        dealsCompletedToday: dealsToday
      },
      pendingSellRequests,
      scheduledInspections,
      activeDeals,
      pendingInquiries,
      upcomingMeetings
    }
  });
});
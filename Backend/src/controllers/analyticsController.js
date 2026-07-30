import catchAsync from '../utils/catchAsync.js';
import SellRequest from '../models/SellRequest.js';
import Deal from '../models/Deal.js';
import TestDrive from '../models/TestDrive.js';
import Inquiry from '../models/Inquiry.js';
import Vehicle from '../models/Vehicle.js';
import User from '../models/User.js';

export const getOverviewAnalytics = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
    if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
  }

  const [
    totalSellRequests,
    pendingSellRequests,
    totalDeals,
    completedDeals,
    totalRevenue,
    totalTestDrives,
    completedTestDrives,
    totalInquiries,
    activeListings,
    totalUsers,
    newUsersThisMonth
  ] = await Promise.all([
    SellRequest.countDocuments(dateFilter),
    SellRequest.countDocuments({ ...dateFilter, status: 'pending' }),
    Deal.countDocuments(dateFilter),
    Deal.countDocuments({ ...dateFilter, status: 'completed' }),
    Deal.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$agreedPrice' } } }
    ]),
    TestDrive.countDocuments(dateFilter),
    TestDrive.countDocuments({ ...dateFilter, status: 'completed' }),
    Inquiry.countDocuments(dateFilter),
    Vehicle.countDocuments({ status: 'active' }),
    User.countDocuments({ role: 'customer' }),
    User.countDocuments({ 
      role: 'customer', 
      createdAt: { $gte: new Date(new Date().setDate(1)) } 
    })
  ]);

  const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Overview analytics retrieved successfully',
    data: {
      sellRequests: { total: totalSellRequests, pending: pendingSellRequests },
      deals: { total: totalDeals, completed: completedDeals, revenue },
      testDrives: { total: totalTestDrives, completed: completedTestDrives },
      inquiries: totalInquiries,
      activeListings,
      users: { total: totalUsers, newThisMonth: newUsersThisMonth }
    }
  });
});

export const getSalesAnalytics = catchAsync(async (req, res, next) => {
  const { startDate, endDate, groupBy = 'month' } = req.query;
  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
    if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
  }

  const format = groupBy === 'day' ? '%Y-%m-%d' : groupBy === 'week' ? '%Y-%U' : '%Y-%m';

  const [
    salesByPeriod,
    salesByBrand,
    salesByCity,
    avgDealValue,
    dealStatusDistribution
  ] = await Promise.all([
    Deal.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      { $group: { 
        _id: { $dateToString: { format, date: '$createdAt' } },
        count: { $sum: 1 },
        revenue: { $sum: '$agreedPrice' }
      }},
      { $sort: { _id: 1 } }
    ]),
    Deal.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      { $lookup: { from: 'vehicles', localField: 'car', foreignField: '_id', as: 'car' }},
      { $unwind: '$car' },
      { $group: { _id: '$car.brand', count: { $sum: 1 }, revenue: { $sum: '$agreedPrice' }}},
      { $sort: { count: -1 }}
    ]),
    Deal.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      { $lookup: { from: 'vehicles', localField: 'car', foreignField: '_id', as: 'car' }},
      { $unwind: '$car' },
      { $group: { _id: '$car.city', count: { $sum: 1 }, revenue: { $sum: '$agreedPrice' }}},
      { $sort: { count: -1 }}
    ]),
    Deal.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      { $group: { _id: null, avg: { $avg: '$agreedPrice' }}}
    ]),
    Deal.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 }}}
    ])
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Sales analytics retrieved successfully',
    data: {
      byPeriod: salesByPeriod,
      byBrand: salesByBrand,
      byCity: salesByCity,
      avgDealValue: avgDealValue[0]?.avg || 0,
      statusDistribution: dealStatusDistribution
    }
  });
});

export const getTestDriveAnalytics = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
    if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
  }

  const [
    totalTestDrives,
    byStatus,
    byBrand,
    byCity,
    conversionRate,
    avgDuration
  ] = await Promise.all([
    TestDrive.countDocuments(dateFilter),
    TestDrive.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 }}}
    ]),
    TestDrive.aggregate([
      { $match: dateFilter },
      { $lookup: { from: 'vehicles', localField: 'car', foreignField: '_id', as: 'car' }},
      { $unwind: '$car' },
      { $group: { _id: '$car.brand', count: { $sum: 1 }}}
    ]),
    TestDrive.aggregate([
      { $match: dateFilter },
      { $lookup: { from: 'vehicles', localField: 'car', foreignField: '_id', as: 'car' }},
      { $unwind: '$car' },
      { $group: { _id: '$car.city', count: { $sum: 1 }}}
    ]),
    TestDrive.aggregate([
      { $match: dateFilter },
      { $group: { 
        _id: null, 
        total: { $sum: 1 },
        completed: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }}
      }}
    ]),
    TestDrive.aggregate([
      { $match: { ...dateFilter, status: 'completed' } },
      { $group: { _id: null, avgDuration: { $avg: '$durationMinutes' }}}
    ])
  ]);

  const conversion = conversionRate[0] ? (conversionRate[0].completed / conversionRate[0].total * 100).toFixed(2) : 0;

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Test drive analytics retrieved successfully',
    data: {
      total: totalTestDrives,
      byStatus,
      byBrand,
      byCity,
      conversionRate: `${conversion}%`,
      avgDuration: avgDuration[0]?.avgDuration || 0
    }
  });
});

export const getInquiryAnalytics = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
    if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
  }

  const [
    totalInquiries,
    byStatus,
    byBrand,
    responseTime,
    openInquiries
  ] = await Promise.all([
    Inquiry.countDocuments(dateFilter),
    Inquiry.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 }}}
    ]),
    Inquiry.aggregate([
      { $match: dateFilter },
      { $lookup: { from: 'vehicles', localField: 'car', foreignField: '_id', as: 'car' }},
      { $unwind: '$car' },
      { $group: { _id: '$car.brand', count: { $sum: 1 }}}
    ]),
    Inquiry.aggregate([
      { $match: { ...dateFilter, status: { $in: ['replied', 'closed'] }} },
      { $project: { responseTime: { $subtract: ['$updatedAt', '$createdAt'] }}},
      { $group: { _id: null, avgHours: { $avg: { $divide: ['$responseTime', 3600000] }}}}
    ]),
    Inquiry.countDocuments({ ...dateFilter, status: { $in: ['open', 'in_progress'] }})
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Inquiry analytics retrieved successfully',
    data: {
      total: totalInquiries,
      byStatus,
      byBrand,
      avgResponseTimeHours: responseTime[0]?.avgHours || 0,
      openInquiries
    }
  });
});

export const getSellRequestAnalytics = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
    if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
  }

  const [
    totalRequests,
    byStatus,
    byBrand,
    byCity,
    avgProcessingTime,
    approvalRate
  ] = await Promise.all([
    SellRequest.countDocuments(dateFilter),
    SellRequest.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 }}}
    ]),
    SellRequest.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$brand', count: { $sum: 1 }}}
    ]),
    SellRequest.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$city', count: { $sum: 1 }}}
    ]),
    SellRequest.aggregate([
      { $match: { ...dateFilter, status: { $in: ['approved', 'rejected', 'listed'] }} },
      { $project: { processingTime: { $subtract: ['$updatedAt', '$createdAt'] }}},
      { $group: { _id: null, avgDays: { $avg: { $divide: ['$processingTime', 86400000] }}}}
    ]),
    SellRequest.aggregate([
      { $match: dateFilter },
      { $group: { 
        _id: null, 
        total: { $sum: 1 },
        approved: { $sum: { $cond: [{ $in: ['$status', ['approved', 'listed']] }, 1, 0] }}
      }}
    ])
  ]);

  const approval = approvalRate[0] ? (approvalRate[0].approved / approvalRate[0].total * 100).toFixed(2) : 0;

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Sell request analytics retrieved successfully',
    data: {
      total: totalRequests,
      byStatus,
      byBrand,
      byCity,
      avgProcessingTimeDays: avgProcessingTime[0]?.avgDays || 0,
      approvalRate: `${approval}%`
    }
  });
});
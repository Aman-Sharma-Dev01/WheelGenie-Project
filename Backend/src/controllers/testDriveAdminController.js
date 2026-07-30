import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import TestDrive from '../models/TestDrive.js';
import Vehicle from '../models/Vehicle.js';
import Notification from '../models/Notification.js';

export const getAllTestDrives = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, status, car, client, official, dateFrom, dateTo } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (status) filter.status = status;
  if (car) filter.car = car;
  if (client) filter.client = client;
  if (official) filter.official = official;
  if (dateFrom || dateTo) {
    filter.scheduledDate = {};
    if (dateFrom) filter.scheduledDate.$gte = new Date(dateFrom);
    if (dateTo) filter.scheduledDate.$lte = new Date(dateTo);
  }

  const [testDrives, total] = await Promise.all([
    TestDrive.find(filter)
      .populate('car', 'brand model variant year city images status')
      .populate('client', 'name email phone')
      .populate('official', 'name email phone')
      .sort({ scheduledDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    TestDrive.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Test drives retrieved successfully',
    data: {
      testDrives,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const getTestDriveByIdAdmin = catchAsync(async (req, res, next) => {
  const testDrive = await TestDrive.findById(req.params.id)
    .populate('car', 'brand model variant year city images status listing')
    .populate('client', 'name email phone address')
    .populate('official', 'name email phone')
    .lean();

  if (!testDrive) {
    return next(new AppError('Test drive not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Test drive retrieved successfully',
    data: { testDrive }
  });
});

export const updateTestDriveStatus = catchAsync(async (req, res, next) => {
  const { status, officialNotes } = req.body;
  const { id } = req.params;

  const validStatuses = ['requested', 'approved', 'rejected', 'scheduled', 'completed', 'cancelled', 'rescheduled'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const testDrive = await TestDrive.findByIdAndUpdate(
    id,
    { 
      status,
      ...(officialNotes && { officialNotes }),
      ...(status === 'approved' && { official: req.user._id }),
      ...(status === 'completed' && { completedAt: new Date() })
    },
    { new: true }
  )
    .populate('car', 'brand model variant client')
    .populate('client', 'name email phone')
    .populate('official', 'name email');

  if (!testDrive) {
    return next(new AppError('Test drive not found', 404));
  }

  let notificationTitle = '';
  let notificationMessage = '';

  switch (status) {
    case 'approved':
      notificationTitle = 'Test Drive Approved';
      notificationMessage = `Your test drive for ${testDrive.car.brand} ${testDrive.car.model} has been approved.`;
      break;
    case 'rejected':
      notificationTitle = 'Test Drive Rejected';
      notificationMessage = `Your test drive for ${testDrive.car.brand} ${testDrive.car.model} was rejected.`;
      break;
    case 'scheduled':
      notificationTitle = 'Test Drive Scheduled';
      notificationMessage = `Your test drive for ${testDrive.car.brand} ${testDrive.car.model} is scheduled for ${testDrive.scheduledDate.toLocaleString()}.`;
      break;
    case 'completed':
      notificationTitle = 'Test Drive Completed';
      notificationMessage = `Your test drive for ${testDrive.car.brand} ${testDrive.car.model} has been completed.`;
      break;
    case 'cancelled':
      notificationTitle = 'Test Drive Cancelled';
      notificationMessage = `Your test drive for ${testDrive.car.brand} ${testDrive.car.model} was cancelled.`;
      break;
  }

  if (notificationTitle) {
    await Notification.create({
      recipient: testDrive.client._id,
      title: notificationTitle,
      message: notificationMessage,
      type: 'System'
    });
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Test drive status updated successfully',
    data: { testDrive }
  });
});

export const approveTestDrive = catchAsync(async (req, res, next) => {
  const { scheduledDate, officialNotes, officialId } = req.body;

  const testDrive = await TestDrive.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'approved',
      official: officialId || req.user._id,
      officialNotes,
      ...(scheduledDate && { scheduledDate: new Date(scheduledDate), status: 'scheduled' })
    },
    { new: true }
  )
    .populate('car', 'brand model variant')
    .populate('client', 'name email phone')
    .populate('official', 'name email');

  if (!testDrive) {
    return next(new AppError('Test drive not found', 404));
  }

  await Notification.create({
    recipient: testDrive.client._id,
    title: 'Test Drive Approved',
    message: `Your test drive for ${testDrive.car.brand} ${testDrive.car.model} has been approved${scheduledDate ? ` and scheduled for ${new Date(scheduledDate).toLocaleString()}` : ''}.`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Test drive approved successfully',
    data: { testDrive }
  });
});

export const rejectTestDrive = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  if (!reason) {
    return next(new AppError('Rejection reason is required', 400));
  }

  const testDrive = await TestDrive.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'rejected',
      officialNotes: reason
    },
    { new: true }
  )
    .populate('car', 'brand model variant')
    .populate('client', 'name email phone');

  if (!testDrive) {
    return next(new AppError('Test drive not found', 404));
  }

  await Notification.create({
    recipient: testDrive.client._id,
    title: 'Test Drive Rejected',
    message: `Your test drive for ${testDrive.car.brand} ${testDrive.car.model} was rejected. Reason: ${reason}`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Test drive rejected successfully',
    data: { testDrive }
  });
});

export const completeTestDrive = catchAsync(async (req, res, next) => {
  const { officialNotes } = req.body;

  const testDrive = await TestDrive.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'completed',
      completedAt: new Date(),
      officialNotes
    },
    { new: true }
  )
    .populate('car', 'brand model variant client')
    .populate('client', 'name email phone')
    .populate('official', 'name email');

  if (!testDrive) {
    return next(new AppError('Test drive not found', 404));
  }

  await Notification.create({
    recipient: testDrive.client._id,
    title: 'Test Drive Completed',
    message: `Your test drive for ${testDrive.car.brand} ${testDrive.car.model} has been completed.`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Test drive completed successfully',
    data: { testDrive }
  });
});
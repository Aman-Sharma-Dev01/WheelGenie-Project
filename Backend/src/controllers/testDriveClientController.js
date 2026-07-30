import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import TestDrive from '../models/TestDrive.js';
import Vehicle from '../models/Vehicle.js';
import Notification from '../models/Notification.js';

export const createTestDrive = catchAsync(async (req, res, next) => {
  const { carId, scheduledDate, durationMinutes, location, notes } = req.body;

  if (!carId || !scheduledDate) {
    return next(new AppError('Car ID and scheduled date are required', 400));
  }

  const car = await Vehicle.findById(carId);
  if (!car) {
    return next(new AppError('Car not found', 404));
  }

  if (car.status !== 'active') {
    return next(new AppError('This car is not available for test drives', 400));
  }

  const existingDrive = await TestDrive.findOne({
    car: carId,
    client: req.user._id,
    status: { $in: ['requested', 'approved', 'scheduled'] }
  });

  if (existingDrive) {
    return next(new AppError('You already have a pending test drive for this car', 400));
  }

  const testDrive = await TestDrive.create({
    car: carId,
    client: req.user._id,
    scheduledDate: new Date(scheduledDate),
    durationMinutes: durationMinutes || 30,
    location: location || {
      type: 'Point',
      coordinates: [0, 0],
      address: car.city || 'WheelGenie Center',
      venue: 'wheelgenie_center'
    },
    clientNotes: notes,
    status: 'requested'
  });

  const populatedDrive = await TestDrive.findById(testDrive._id)
    .populate('car', 'brand model variant year city images')
    .populate('official', 'name email phone')
    .lean();

  await Notification.create({
    recipient: req.user._id,
    title: 'Test Drive Requested',
    message: `Your test drive request for ${car.brand} ${car.model} has been submitted.`,
    type: 'System'
  });

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Test drive requested successfully',
    data: { testDrive: populatedDrive }
  });
});

export const getMyTestDrives = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;
  const skip = (page - 1) * limit;

  const filter = { client: req.user._id };
  if (status) filter.status = status;

  const [testDrives, total] = await Promise.all([
    TestDrive.find(filter)
      .populate('car', 'brand model variant year city images status')
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

export const getTestDriveById = catchAsync(async (req, res, next) => {
  const testDrive = await TestDrive.findOne({
    _id: req.params.id,
    client: req.user._id
  })
    .populate('car', 'brand model variant year city images status listing')
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

export const rescheduleTestDrive = catchAsync(async (req, res, next) => {
  const { newDate, reason } = req.body;

  if (!newDate) {
    return next(new AppError('New date is required', 400));
  }

  const testDrive = await TestDrive.findOne({
    _id: req.params.id,
    client: req.user._id
  }).populate('car', 'brand model variant');

  if (!testDrive) {
    return next(new AppError('Test drive not found', 404));
  }

  if (!['requested', 'approved', 'scheduled'].includes(testDrive.status)) {
    return next(new AppError('Cannot reschedule test drive in current status', 400));
  }

  testDrive.rescheduleHistory.push({
    previousDate: testDrive.scheduledDate,
    newDate: new Date(newDate),
    reason: reason || 'Client requested reschedule',
    requestedBy: req.user._id
  });
  testDrive.scheduledDate = new Date(newDate);
  testDrive.status = 'rescheduled';
  await testDrive.save();

  const populatedDrive = await TestDrive.findById(testDrive._id)
    .populate('car', 'brand model variant year city images')
    .populate('official', 'name email phone')
    .lean();

  await Notification.create({
    recipient: testDrive.official || req.user._id,
    title: 'Test Drive Rescheduled',
    message: `Test drive for ${testDrive.car.brand} ${testDrive.car.model} rescheduled to ${new Date(newDate).toLocaleString()}.`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Test drive rescheduled successfully',
    data: { testDrive: populatedDrive }
  });
});

export const cancelTestDrive = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  const testDrive = await TestDrive.findOne({
    _id: req.params.id,
    client: req.user._id
  }).populate('car', 'brand model variant');

  if (!testDrive) {
    return next(new AppError('Test drive not found', 404));
  }

  if (!['requested', 'approved', 'scheduled', 'rescheduled'].includes(testDrive.status)) {
    return next(new AppError('Cannot cancel test drive in current status', 400));
  }

  testDrive.status = 'cancelled';
  testDrive.cancelledBy = req.user._id;
  testDrive.cancellationReason = reason || 'Cancelled by client';
  await testDrive.save();

  await Notification.create({
    recipient: testDrive.official || req.user._id,
    title: 'Test Drive Cancelled',
    message: `Test drive for ${testDrive.car.brand} ${testDrive.car.model} was cancelled. Reason: ${reason || 'Not specified'}`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Test drive cancelled successfully',
    data: { testDrive }
  });
});
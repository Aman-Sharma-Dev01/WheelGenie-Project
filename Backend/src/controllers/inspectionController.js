import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Inspection from '../models/Inspection.js';
import SellRequest from '../models/SellRequest.js';
import Notification from '../models/Notification.js';

export const createInspection = catchAsync(async (req, res, next) => {
  const { sellRequestId, scheduledDate, inspectedBy } = req.body;

  const sellRequest = await SellRequest.findById(sellRequestId).populate('client');
  if (!sellRequest) {
    return next(new AppError('Sell request not found', 404));
  }

  const existingInspection = await Inspection.findOne({ sellRequest: sellRequestId });
  if (existingInspection) {
    return next(new AppError('Inspection already exists for this sell request', 400));
  }

  const inspection = await Inspection.create({
    sellRequest: sellRequestId,
    inspectedBy: inspectedBy || req.user._id,
    scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined,
    status: 'scheduled'
  });

  sellRequest.status = 'inspection_scheduled';
  sellRequest.inspectionDate = inspection.scheduledDate;
  sellRequest.inspectedBy = inspection.inspectedBy;
  await sellRequest.save();

  await Notification.create({
    recipient: sellRequest.client._id,
    title: 'Inspection Scheduled',
    message: `Inspection for your ${sellRequest.brand} ${sellRequest.model} has been scheduled.`,
    type: 'System'
  });

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Inspection created successfully',
    data: { inspection }
  });
});

export const getInspectionById = catchAsync(async (req, res, next) => {
  const inspection = await Inspection.findById(req.params.id)
    .populate('sellRequest', 'brand model variant year city client')
    .populate('inspectedBy', 'name email')
    .lean();

  if (!inspection) {
    return next(new AppError('Inspection not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Inspection retrieved successfully',
    data: { inspection }
  });
});

export const updateInspection = catchAsync(async (req, res, next) => {
  const allowedUpdates = [
    'status', 'scheduledDate', 'completedDate',
    'exterior', 'interior', 'mechanical', 'testDrive',
    'documents', 'overallRating', 'estimatedValue',
    'recommendation', 'repairEstimate', 'officialNotes'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) updates[key] = req.body[key];
  });

  if (updates.status === 'completed' && !updates.completedDate) {
    updates.completedDate = new Date();
  }

  const inspection = await Inspection.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate('sellRequest', 'brand model variant year city client')
    .populate('inspectedBy', 'name email');

  if (!inspection) {
    return next(new AppError('Inspection not found', 404));
  }

  if (updates.status === 'completed') {
    const sellRequest = await SellRequest.findById(inspection.sellRequest._id);
    if (sellRequest) {
      sellRequest.status = 'inspection_completed';
      sellRequest.inspectionNotes = updates.officialNotes;
      sellRequest.inspectedBy = req.user._id;
      await sellRequest.save();

      await Notification.create({
        recipient: sellRequest.client,
        title: 'Inspection Completed',
        message: `Inspection for your ${sellRequest.brand} ${sellRequest.model} has been completed.`,
        type: 'System'
      });
    }
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Inspection updated successfully',
    data: { inspection }
  });
});

export const getInspectionBySellRequest = catchAsync(async (req, res, next) => {
  const inspection = await Inspection.findOne({ sellRequest: req.params.id })
    .populate('sellRequest', 'brand model variant year city client')
    .populate('inspectedBy', 'name email')
    .lean();

  if (!inspection) {
    return next(new AppError('Inspection not found for this sell request', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Inspection retrieved successfully',
    data: { inspection }
  });
});

export const uploadInspectionImages = catchAsync(async (req, res, next) => {
  const { images } = req.body;

  if (!images || !Array.isArray(images) || images.length === 0) {
    return next(new AppError('Images array is required', 400));
  }

  const validCategories = ['exterior', 'interior', 'mechanical', 'documents', 'damage', 'other'];
  for (const img of images) {
    if (!validCategories.includes(img.category)) {
      return next(new AppError(`Invalid image category: ${img.category}`, 400));
    }
  }

  const inspection = await Inspection.findByIdAndUpdate(
    req.params.id,
    { $push: { images: { $each: images } } },
    { new: true }
  ).populate('sellRequest', 'brand model variant year city client')
    .populate('inspectedBy', 'name email');

  if (!inspection) {
    return next(new AppError('Inspection not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Images uploaded successfully',
    data: { inspection }
  });
});

export const uploadInspectionReport = catchAsync(async (req, res, next) => {
  const { reportUrl, reportPublicId } = req.body;

  if (!reportUrl) {
    return next(new AppError('Report URL is required', 400));
  }

  const inspection = await Inspection.findByIdAndUpdate(
    req.params.id,
    { $set: { reportUrl, reportPublicId } },
    { new: true }
  ).populate('sellRequest', 'brand model variant year city client')
    .populate('inspectedBy', 'name email');

  if (!inspection) {
    return next(new AppError('Inspection not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Inspection report uploaded successfully',
    data: { inspection }
  });
});
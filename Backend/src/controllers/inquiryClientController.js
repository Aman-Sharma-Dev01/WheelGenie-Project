import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Inquiry from '../models/Inquiry.js';
import Vehicle from '../models/Vehicle.js';
import Notification from '../models/Notification.js';

export const createInquiry = catchAsync(async (req, res, next) => {
  const { carId, subject, message } = req.body;

  if (!carId || !subject || !message) {
    return next(new AppError('Car ID, subject, and message are required', 400));
  }

  const car = await Vehicle.findById(carId);
  if (!car) {
    return next(new AppError('Car not found', 404));
  }

  const inquiry = await Inquiry.create({
    car: carId,
    client: req.user._id,
    subject,
    message,
    status: 'open'
  });

  const populatedInquiry = await Inquiry.findById(inquiry._id)
    .populate('car', 'brand model variant year city images')
    .populate('official', 'name email')
    .lean();

  await Notification.create({
    recipient: req.user._id,
    title: 'Inquiry Submitted',
    message: `Your inquiry about ${car.brand} ${car.model} has been submitted.`,
    type: 'System'
  });

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Inquiry created successfully',
    data: { inquiry: populatedInquiry }
  });
});

export const getMyInquiries = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;
  const skip = (page - 1) * limit;

  const filter = { client: req.user._id };
  if (status) filter.status = status;

  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter)
      .populate('car', 'brand model variant year city images status')
      .populate('official', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Inquiry.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Inquiries retrieved successfully',
    data: {
      inquiries,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const getInquiryById = catchAsync(async (req, res, next) => {
  const inquiry = await Inquiry.findOne({ _id: req.params.id, client: req.user._id })
    .populate('car', 'brand model variant year city images status listing')
    .populate('official', 'name email phone')
    .populate('replies.sender', 'name email')
    .lean();

  if (!inquiry) {
    return next(new AppError('Inquiry not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Inquiry retrieved successfully',
    data: { inquiry }
  });
});

export const closeInquiry = catchAsync(async (req, res, next) => {
  const inquiry = await Inquiry.findOneAndUpdate(
    { _id: req.params.id, client: req.user._id, status: { $ne: 'closed' } },
    { 
      status: 'closed', 
      closedAt: new Date(), 
      closedBy: req.user._id 
    },
    { new: true }
  )
    .populate('car', 'brand model variant')
    .populate('official', 'name email')
    .lean();

  if (!inquiry) {
    return next(new AppError('Inquiry not found or already closed', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Inquiry closed successfully',
    data: { inquiry }
  });
});
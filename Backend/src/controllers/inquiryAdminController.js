import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Inquiry from '../models/Inquiry.js';
import Vehicle from '../models/Vehicle.js';
import Notification from '../models/Notification.js';

export const getAllInquiries = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, status, car, client, official } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (status) filter.status = status;
  if (car) filter.car = car;
  if (client) filter.client = client;
  if (official) filter.official = official;

  const [inquiries, total] = await Promise.all([
    Inquiry.find(filter)
      .populate('car', 'brand model variant year city status')
      .populate('client', 'name email phone')
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

export const getInquiryByIdAdmin = catchAsync(async (req, res, next) => {
  const inquiry = await Inquiry.findById(req.params.id)
    .populate('car', 'brand model variant year city images status listing')
    .populate('client', 'name email phone address')
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

export const replyToInquiry = catchAsync(async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return next(new AppError('Reply message is required', 400));
  }

  const inquiry = await Inquiry.findById(req.params.id)
    .populate('car', 'brand model variant')
    .populate('client', 'name email phone');

  if (!inquiry) {
    return next(new AppError('Inquiry not found', 404));
  }

  inquiry.replies.push({
    sender: req.user._id,
    message,
    isOfficial: true
  });
  inquiry.status = 'replied';
  if (!inquiry.official) inquiry.official = req.user._id;
  await inquiry.save();

  await Notification.create({
    recipient: inquiry.client._id,
    title: 'New Reply to Your Inquiry',
    message: `Official replied to your inquiry about ${inquiry.car.brand} ${inquiry.car.model}.`,
    type: 'System'
  });

  const populatedInquiry = await Inquiry.findById(inquiry._id)
    .populate('car', 'brand model variant year city')
    .populate('client', 'name email phone')
    .populate('official', 'name email')
    .populate('replies.sender', 'name email')
    .lean();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Reply sent successfully',
    data: { inquiry: populatedInquiry }
  });
});

export const updateInquiryStatus = catchAsync(async (req, res, next) => {
  const { status, officialNotes } = req.body;

  const validStatuses = ['open', 'in_progress', 'replied', 'closed'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const updateData = { status };
  if (officialNotes) {
    updateData.$push = { replies: { sender: req.user._id, message: officialNotes, isOfficial: true } };
  }
  if (status === 'closed') {
    updateData.closedAt = new Date();
    updateData.closedBy = req.user._id;
  }

  const inquiry = await Inquiry.findByIdAndUpdate(
    req.params.id,
    updateData,
    { new: true }
  )
    .populate('car', 'brand model variant')
    .populate('client', 'name email phone')
    .populate('official', 'name email')
    .populate('replies.sender', 'name email')
    .lean();

  if (!inquiry) {
    return next(new AppError('Inquiry not found', 404));
  }

  if (status === 'closed') {
    await Notification.create({
      recipient: inquiry.client._id,
      title: 'Inquiry Closed',
      message: `Your inquiry about ${inquiry.car.brand} ${inquiry.car.model} has been closed.`,
      type: 'System'
    });
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Inquiry status updated successfully',
    data: { inquiry }
  });
});
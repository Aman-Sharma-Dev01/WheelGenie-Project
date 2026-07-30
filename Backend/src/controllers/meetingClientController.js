import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Meeting from '../models/Meeting.js';
import SellRequest from '../models/SellRequest.js';
import Notification from '../models/Notification.js';

export const getMyMeetings = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status, type } = req.query;
  const skip = (page - 1) * limit;

  const filter = { client: req.user._id };
  if (status) filter.status = status;
  if (type) filter.type = type;

  const [meetings, total] = await Promise.all([
    Meeting.find(filter)
      .populate('sellRequest', 'brand model variant year city status')
      .populate('official', 'name email phone')
      .sort({ scheduledDate: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Meeting.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Meetings retrieved successfully',
    data: {
      meetings,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const getMeetingByIdClient = catchAsync(async (req, res, next) => {
  const meeting = await Meeting.findOne({
    _id: req.params.id,
    client: req.user._id
  })
    .populate('sellRequest', 'brand model variant year city status images')
    .populate('official', 'name email phone')
    .lean();

  if (!meeting) {
    return next(new AppError('Meeting not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Meeting retrieved successfully',
    data: { meeting }
  });
});

export const requestReschedule = catchAsync(async (req, res, next) => {
  const { preferredDate, reason } = req.body;

  if (!preferredDate) {
    return next(new AppError('Preferred date is required for rescheduling', 400));
  }

  const meeting = await Meeting.findOne({
    _id: req.params.id,
    client: req.user._id
  }).populate('sellRequest', 'brand model variant client');

  if (!meeting) {
    return next(new AppError('Meeting not found', 404));
  }

  if (!['scheduled', 'confirmed'].includes(meeting.status)) {
    return next(new AppError('Cannot reschedule meeting in current status', 400));
  }

  meeting.status = 'rescheduled';
  meeting.rescheduledTo = meeting._id;
  meeting.notes = `Reschedule requested: ${reason || 'No reason provided'}`;
  await meeting.save();

  const newMeeting = await Meeting.create({
    sellRequest: meeting.sellRequest._id,
    client: meeting.client,
    official: meeting.official,
    type: meeting.type,
    scheduledDate: new Date(preferredDate),
    durationMinutes: meeting.durationMinutes,
    location: meeting.location,
    rescheduledFrom: meeting._id
  });

  meeting.rescheduledTo = newMeeting._id;
  await meeting.save();

  await Notification.create({
    recipient: meeting.official,
    title: 'Meeting Reschedule Requested',
    message: `Client requested to reschedule ${meeting.type} for ${meeting.sellRequest.brand} ${meeting.sellRequest.model} to ${new Date(preferredDate).toLocaleDateString()}.`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Reschedule requested successfully',
    data: { meeting: newMeeting }
  });
});

export const cancelMeeting = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  const meeting = await Meeting.findOne({
    _id: req.params.id,
    client: req.user._id
  }).populate('sellRequest', 'brand model variant client');

  if (!meeting) {
    return next(new AppError('Meeting not found', 404));
  }

  if (!['scheduled', 'confirmed'].includes(meeting.status)) {
    return next(new AppError('Cannot cancel meeting in current status', 400));
  }

  meeting.status = 'cancelled';
  meeting.cancelledBy = req.user._id;
  meeting.cancellationReason = reason || 'Cancelled by client';
  await meeting.save();

  await Notification.create({
    recipient: meeting.official,
    title: 'Meeting Cancelled by Client',
    message: `Client cancelled ${meeting.type} for ${meeting.sellRequest.brand} ${meeting.sellRequest.model}. Reason: ${reason || 'Not specified'}`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Meeting cancelled successfully',
    data: { meeting }
  });
});

export const confirmMeeting = catchAsync(async (req, res, next) => {
  const meeting = await Meeting.findOne({
    _id: req.params.id,
    client: req.user._id
  });

  if (!meeting) {
    return next(new AppError('Meeting not found', 404));
  }

  if (meeting.status !== 'scheduled') {
    return next(new AppError('Meeting cannot be confirmed in current status', 400));
  }

  meeting.status = 'confirmed';
  await meeting.save();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Meeting confirmed successfully',
    data: { meeting }
  });
});

export const submitFeedback = catchAsync(async (req, res, next) => {
  const { feedback, rating } = req.body;

  const meeting = await Meeting.findOne({
    _id: req.params.id,
    client: req.user._id
  });

  if (!meeting) {
    return next(new AppError('Meeting not found', 404));
  }

  if (meeting.status !== 'completed') {
    return next(new AppError('Can only submit feedback for completed meetings', 400));
  }

  meeting.clientFeedback = feedback;
  await meeting.save();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Feedback submitted successfully',
    data: { meeting }
  });
});
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Paperwork from '../models/Paperwork.js';
import Deal from '../models/Deal.js';
import Notification from '../models/Notification.js';

export const getMyPaperworks = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;
  const skip = (page - 1) * limit;

  const filter = { client: req.user._id };
  if (status) filter.status = status;

  const [paperworks, total] = await Promise.all([
    Paperwork.find(filter)
      .populate('deal', 'agreedPrice status')
      .populate('deal.car', 'brand model variant year city images')
      .populate('official', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Paperwork.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Paperworks retrieved successfully',
    data: {
      paperworks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const getPaperworkById = catchAsync(async (req, res, next) => {
  const paperwork = await Paperwork.findOne({ _id: req.params.id, client: req.user._id })
    .populate('deal', 'agreedPrice status milestones paymentDetails')
    .populate('deal.car', 'brand model variant year city images')
    .populate('official', 'name email phone')
    .populate('documents.uploadedBy', 'name email')
    .populate('documents.verifiedBy', 'name email')
    .lean();

  if (!paperwork) {
    return next(new AppError('Paperwork not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Paperwork retrieved successfully',
    data: { paperwork }
  });
});

export const getPaperworkDocuments = catchAsync(async (req, res, next) => {
  const paperwork = await Paperwork.findOne({ _id: req.params.id, client: req.user._id })
    .select('documents')
    .populate('documents.uploadedBy', 'name email')
    .populate('documents.verifiedBy', 'name email')
    .lean();

  if (!paperwork) {
    return next(new AppError('Paperwork not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Documents retrieved successfully',
    data: { documents: paperwork.documents }
  });
});
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Deal from '../models/Deal.js';

export const getMyDeals = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;
  const skip = (page - 1) * limit;

  const filter = { client: req.user._id };
  if (status) filter.status = status;

  const [deals, total] = await Promise.all([
    Deal.find(filter)
      .populate('car', 'brand model variant year city images status')
      .populate('official', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Deal.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Deals retrieved successfully',
    data: {
      deals,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const getDealById = catchAsync(async (req, res, next) => {
  const deal = await Deal.findOne({ _id: req.params.id, client: req.user._id })
    .populate('car', 'brand model variant year city images status listing')
    .populate('official', 'name email phone')
    .populate('sellRequest', 'brand model variant expectedPrice')
    .lean();

  if (!deal) {
    return next(new AppError('Deal not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Deal retrieved successfully',
    data: { deal }
  });
});
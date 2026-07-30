import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import SellRequest from '../models/SellRequest.js';

export const createSellRequest = catchAsync(async (req, res, next) => {
  const sellRequest = await SellRequest.create({
    ...req.body,
    client: req.user._id
  });

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Sell request created successfully',
    data: { sellRequest }
  });
});

export const getMySellRequests = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status } = req.query;
  const skip = (page - 1) * limit;

  const filter = { client: req.user._id };
  if (status) filter.status = status;

  const [sellRequests, total] = await Promise.all([
    SellRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    SellRequest.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Sell requests retrieved successfully',
    data: {
      sellRequests,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const getSellRequestById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const sellRequest = await SellRequest.findOne({ _id: id, client: req.user._id })
    .populate('client', 'name email phone')
    .populate('assignedOfficial', 'name email')
    .populate('listedVehicle')
    .populate('listedListing')
    .lean();

  if (!sellRequest) {
    return next(new AppError('Sell request not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Sell request retrieved successfully',
    data: { sellRequest }
  });
});

export const updateSellRequest = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const sellRequest = await SellRequest.findOneAndUpdate(
    { _id: id, client: req.user._id, status: 'pending' },
    req.body,
    { new: true, runValidators: true }
  );

  if (!sellRequest) {
    return next(new AppError('Sell request not found or cannot be updated', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Sell request updated successfully',
    data: { sellRequest }
  });
});

export const addImages = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { images } = req.body;

  const sellRequest = await SellRequest.findOneAndUpdate(
    { _id: id, client: req.user._id },
    { $push: { images: { $each: images } } },
    { new: true }
  );

  if (!sellRequest) {
    return next(new AppError('Sell request not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Images added successfully',
    data: { sellRequest }
  });
});

export const deleteImage = catchAsync(async (req, res, next) => {
  const { id, imageId } = req.params;

  const sellRequest = await SellRequest.findOneAndUpdate(
    { _id: id, client: req.user._id },
    { $pull: { images: { _id: imageId } } },
    { new: true }
  );

  if (!sellRequest) {
    return next(new AppError('Sell request not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Image removed successfully',
    data: { sellRequest }
  });
});

export const addDocuments = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { documents } = req.body;

  const sellRequest = await SellRequest.findOneAndUpdate(
    { _id: id, client: req.user._id },
    { $push: { documents: { $each: documents } } },
    { new: true }
  );

  if (!sellRequest) {
    return next(new AppError('Sell request not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Documents added successfully',
    data: { sellRequest }
  });
});

export const deleteDocument = catchAsync(async (req, res, next) => {
  const { id, documentId } = req.params;

  const sellRequest = await SellRequest.findOneAndUpdate(
    { _id: id, client: req.user._id },
    { $pull: { documents: { _id: documentId } } },
    { new: true }
  );

  if (!sellRequest) {
    return next(new AppError('Sell request not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Document removed successfully',
    data: { sellRequest }
  });
});

export const cancelSellRequest = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const sellRequest = await SellRequest.findOneAndUpdate(
    { _id: id, client: req.user._id, status: { $in: ['pending', 'inspection_scheduled'] } },
    { status: 'cancelled' },
    { new: true }
  );

  if (!sellRequest) {
    return next(new AppError('Sell request not found or cannot be cancelled', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Sell request cancelled successfully',
    data: { sellRequest }
  });
});

export const deleteSellRequest = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const sellRequest = await SellRequest.findOne({
    _id: id,
    client: req.user._id
  });

  if (!sellRequest) {
    return next(new AppError('Sell request not found', 404));
  }

  if (!['pending', 'rejected', 'cancelled'].includes(sellRequest.status)) {
    return next(new AppError('Cannot delete sell request in current status', 400));
  }

  await SellRequest.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Sell request deleted successfully'
  });
});
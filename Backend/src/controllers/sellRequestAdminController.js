import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import SellRequest from '../models/SellRequest.js';
import Vehicle from '../models/Vehicle.js';
import Listing from '../models/Listing.js';
import Notification from '../models/Notification.js';

export const getAllSellRequests = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, status, search } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { brand: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } },
      { variant: { $regex: search, $options: 'i' } }
    ];
  }

  const [sellRequests, total] = await Promise.all([
    SellRequest.find(filter)
      .populate('client', 'name email phone')
      .populate('inspectedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
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

export const getSellRequestByIdAdmin = catchAsync(async (req, res, next) => {
  const sellRequest = await SellRequest.findById(req.params.id)
    .populate('client', 'name email phone address')
    .populate('inspectedBy', 'name email')
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

export const scheduleInspection = catchAsync(async (req, res, next) => {
  const { inspectionDate, notes } = req.body;
  const { id } = req.params;

  if (!inspectionDate) {
    return next(new AppError('Inspection date is required', 400));
  }

  const sellRequest = await SellRequest.findByIdAndUpdate(
    id,
    {
      status: 'inspection_scheduled',
      inspectionDate: new Date(inspectionDate),
      officialNotes: notes,
      inspectedBy: req.user._id
    },
    { new: true }
  ).populate('client', 'name email phone');

  if (!sellRequest) {
    return next(new AppError('Sell request not found', 404));
  }

  await Notification.create({
    recipient: sellRequest.client._id,
    title: 'Inspection Scheduled',
    message: `Inspection for your ${sellRequest.brand} ${sellRequest.model} is scheduled on ${new Date(inspectionDate).toLocaleDateString()}.`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Inspection scheduled successfully',
    data: { sellRequest }
  });
});

export const completeInspection = catchAsync(async (req, res, next) => {
  const { inspectionNotes, officialNotes } = req.body;
  const { id } = req.params;

  const sellRequest = await SellRequest.findByIdAndUpdate(
    id,
    {
      status: 'inspection_completed',
      inspectionNotes,
      officialNotes,
      inspectedBy: req.user._id
    },
    { new: true }
  ).populate('client', 'name email phone');

  if (!sellRequest) {
    return next(new AppError('Sell request not found', 404));
  }

  await Notification.create({
    recipient: sellRequest.client._id,
    title: 'Inspection Completed',
    message: `Inspection for your ${sellRequest.brand} ${sellRequest.model} has been completed.`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Inspection completed successfully',
    data: { sellRequest }
  });
});

export const approveSellRequest = catchAsync(async (req, res, next) => {
  const { listingPrice, description } = req.body;
  const { id } = req.params;

  const sellRequest = await SellRequest.findById(id).populate('client', 'name email phone');

  if (!sellRequest) {
    return next(new AppError('Sell request not found', 404));
  }

  if (sellRequest.status !== 'inspection_completed') {
    return next(new AppError('Sell request must be inspection completed to approve', 400));
  }

  const vehicle = await Vehicle.create({
    owner: sellRequest.client._id,
    brand: sellRequest.brand,
    model: sellRequest.model,
    variant: sellRequest.variant,
    fuel: sellRequest.fuel,
    transmission: sellRequest.transmission,
    kms: sellRequest.kms,
    year: sellRequest.year,
    ownership: sellRequest.ownership,
    city: sellRequest.city,
    images: sellRequest.images.map(img => img.url),
    status: 'active'
  });

  const listing = await Listing.create({
    vehicle: vehicle._id,
    seller: sellRequest.client._id,
    price: listingPrice || sellRequest.expectedPrice,
    description: description || sellRequest.description,
    status: 'active'
  });

  sellRequest.status = 'listed';
  sellRequest.listedVehicle = vehicle._id;
  sellRequest.listedListing = listing._id;
  await sellRequest.save();

  await Notification.create({
    recipient: sellRequest.client._id,
    title: 'Vehicle Listed for Sale',
    message: `Your ${sellRequest.brand} ${sellRequest.model} has been listed for ₹${listingPrice || sellRequest.expectedPrice}.`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Sell request approved and vehicle listed successfully',
    data: { sellRequest, vehicle, listing }
  });
});

export const rejectSellRequest = catchAsync(async (req, res, next) => {
  const { reason } = req.body;
  const { id } = req.params;

  if (!reason) {
    return next(new AppError('Rejection reason is required', 400));
  }

  const sellRequest = await SellRequest.findByIdAndUpdate(
    id,
    {
      status: 'rejected',
      rejectionReason: reason
    },
    { new: true }
  ).populate('client', 'name email phone');

  if (!sellRequest) {
    return next(new AppError('Sell request not found', 404));
  }

  await Notification.create({
    recipient: sellRequest.client._id,
    title: 'Sell Request Rejected',
    message: `Your sell request for ${sellRequest.brand} ${sellRequest.model} was rejected. Reason: ${reason}`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Sell request rejected successfully',
    data: { sellRequest }
  });
});

export const updateSellRequestStatus = catchAsync(async (req, res, next) => {
  const { status, officialNotes } = req.body;
  const { id } = req.params;

  const validStatuses = ['pending', 'inspection_scheduled', 'inspection_completed', 'approved', 'rejected', 'listed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const sellRequest = await SellRequest.findByIdAndUpdate(
    id,
    { status, officialNotes },
    { new: true }
  ).populate('client', 'name email phone');

  if (!sellRequest) {
    return next(new AppError('Sell request not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Sell request status updated successfully',
    data: { sellRequest }
  });
});

export const updateSellRequestAdmin = catchAsync(async (req, res, next) => {
  const allowedUpdates = [
    'brand', 'model', 'variant', 'fuel', 'transmission', 'kms',
    'year', 'ownership', 'city', 'expectedPrice', 'description',
    'inspectionDate', 'inspectionNotes', 'officialNotes'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) updates[key] = req.body[key];
  });

  const sellRequest = await SellRequest.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate('client', 'name email phone')
    .populate('inspectedBy', 'name email');

  if (!sellRequest) {
    return next(new AppError('Sell request not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Sell request updated successfully',
    data: { sellRequest }
  });
});

export const assignOfficial = catchAsync(async (req, res, next) => {
  const { officialId } = req.body;

  if (!officialId) {
    return next(new AppError('Official ID is required', 400));
  }

  const sellRequest = await SellRequest.findByIdAndUpdate(
    req.params.id,
    { $set: { assignedOfficial: officialId } },
    { new: true }
  ).populate('client', 'name email phone');

  if (!sellRequest) {
    return next(new AppError('Sell request not found', 404));
  }

  await Notification.create({
    recipient: sellRequest.client._id,
    title: 'Official Assigned',
    message: `An official has been assigned to your ${sellRequest.brand} ${sellRequest.model} sell request.`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Official assigned successfully',
    data: { sellRequest }
  });
});

export const requestMoreDetails = catchAsync(async (req, res, next) => {
  const { message } = req.body;

  if (!message) {
    return next(new AppError('Message is required', 400));
  }

  const sellRequest = await SellRequest.findByIdAndUpdate(
    req.params.id,
    { 
      $set: { 
        status: 'pending',
        officialNotes: `More details requested: ${message}`
      } 
    },
    { new: true }
  ).populate('client', 'name email phone');

  if (!sellRequest) {
    return next(new AppError('Sell request not found', 404));
  }

  await Notification.create({
    recipient: sellRequest.client._id,
    title: 'More Details Required',
    message: `An official has requested more details for your ${sellRequest.brand} ${sellRequest.model}: ${message}`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'More details requested successfully',
    data: { sellRequest }
  });
});
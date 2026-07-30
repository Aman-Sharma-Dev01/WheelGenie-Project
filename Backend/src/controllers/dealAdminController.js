import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Deal from '../models/Deal.js';
import Vehicle from '../models/Vehicle.js';
import Notification from '../models/Notification.js';

export const createDeal = catchAsync(async (req, res, next) => {
  const { carId, clientId, agreedPrice, sellRequestId, milestones } = req.body;

  const car = await Vehicle.findById(carId).populate('owner');
  if (!car) {
    return next(new AppError('Car not found', 404));
  }

  const deal = await Deal.create({
    car: carId,
    client: clientId,
    official: req.user._id,
    agreedPrice,
    sellRequest: sellRequestId,
    milestones: milestones || [],
    status: 'draft'
  });

  car.status = 'reserved';
  await car.save();

  const populatedDeal = await Deal.findById(deal._id)
    .populate('car', 'brand model variant year city images')
    .populate('client', 'name email phone')
    .populate('official', 'name email')
    .lean();

  await Notification.create({
    recipient: clientId,
    title: 'New Deal Created',
    message: `A deal has been created for ${car.brand} ${car.model} at ₹${agreedPrice.toLocaleString()}.`,
    type: 'System'
  });

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Deal created successfully',
    data: { deal: populatedDeal }
  });
});

export const getAllDeals = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, status, car, client, official } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (status) filter.status = status;
  if (car) filter.car = car;
  if (client) filter.client = client;
  if (official) filter.official = official;

  const [deals, total] = await Promise.all([
    Deal.find(filter)
      .populate('car', 'brand model variant year city status')
      .populate('client', 'name email phone')
      .populate('official', 'name email')
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

export const getDealByIdAdmin = catchAsync(async (req, res, next) => {
  const deal = await Deal.findById(req.params.id)
    .populate('car', 'brand model variant year city images status listing')
    .populate('client', 'name email phone address')
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

export const updateDeal = catchAsync(async (req, res, next) => {
  const allowedUpdates = ['agreedPrice', 'milestones', 'paymentDetails'];
  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) updates[key] = req.body[key];
  });

  const deal = await Deal.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  )
    .populate('car', 'brand model variant year city')
    .populate('client', 'name email phone')
    .populate('official', 'name email')
    .lean();

  if (!deal) {
    return next(new AppError('Deal not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Deal updated successfully',
    data: { deal }
  });
});

export const updateDealStatus = catchAsync(async (req, res, next) => {
  const { status, paymentDetails, cancellationReason } = req.body;

  const validStatuses = ['draft', 'pending_payment', 'payment_received', 'documents_pending', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const updateData = { status };
  if (paymentDetails) {
    updateData.paymentDetails = paymentDetails;
    if (status === 'payment_received') {
      updateData['paymentDetails.receivedAt'] = paymentDetails.receivedAt || new Date();
    }
  }
  if (cancellationReason) {
    updateData.cancellationReason = cancellationReason;
    updateData.cancelledAt = new Date();
    updateData.cancelledBy = req.user._id;
  }

  const deal = await Deal.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate('car', 'brand model variant')
    .populate('client', 'name email phone')
    .populate('official', 'name email')
    .lean();

  if (!deal) {
    return next(new AppError('Deal not found', 404));
  }

  let notificationTitle = '';
  let notificationMessage = '';

  switch (status) {
    case 'payment_received':
      notificationTitle = 'Payment Received';
      notificationMessage = `Payment received for your deal on ${deal.car.brand} ${deal.car.model}.`;
      break;
    case 'completed':
      notificationTitle = 'Deal Completed';
      notificationMessage = `Your deal for ${deal.car.brand} ${deal.car.model} has been completed.`;
      break;
    case 'cancelled':
      notificationTitle = 'Deal Cancelled';
      notificationMessage = `Your deal for ${deal.car.brand} ${deal.car.model} was cancelled. ${cancellationReason ? `Reason: ${cancellationReason}` : ''}`;
      break;
  }

  if (notificationTitle) {
    await Notification.create({
      recipient: deal.client._id,
      title: notificationTitle,
      message: notificationMessage,
      type: 'System'
    });
  }

  if (status === 'completed') {
    const car = await Vehicle.findById(deal.car._id);
    if (car) {
      car.status = 'sold';
      await car.save();
    }
  } else if (status === 'cancelled') {
    const car = await Vehicle.findById(deal.car._id);
    if (car && car.status === 'reserved') {
      car.status = 'active';
      await car.save();
    }
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Deal status updated successfully',
    data: { deal }
  });
});

export const cancelDeal = catchAsync(async (req, res, next) => {
  const { reason } = req.body;

  const deal = await Deal.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'cancelled',
      cancellationReason: reason,
      cancelledAt: new Date(),
      cancelledBy: req.user._id
    },
    { new: true }
  )
    .populate('car', 'brand model variant')
    .populate('client', 'name email phone')
    .lean();

  if (!deal) {
    return next(new AppError('Deal not found', 404));
  }

  const car = await Vehicle.findById(deal.car._id);
  if (car && car.status === 'reserved') {
    car.status = 'active';
    await car.save();
  }

  await Notification.create({
    recipient: deal.client._id,
    title: 'Deal Cancelled',
    message: `Your deal for ${deal.car.brand} ${deal.car.model} was cancelled. Reason: ${reason}`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Deal cancelled successfully',
    data: { deal }
  });
});

export const completeDeal = catchAsync(async (req, res, next) => {
  const deal = await Deal.findByIdAndUpdate(
    req.params.id,
    { 
      status: 'completed',
      completedAt: new Date()
    },
    { new: true }
  )
    .populate('car', 'brand model variant')
    .populate('client', 'name email phone')
    .populate('official', 'name email')
    .lean();

  if (!deal) {
    return next(new AppError('Deal not found', 404));
  }

  const car = await Vehicle.findById(deal.car._id);
  if (car) {
    car.status = 'sold';
    await car.save();
  }

  await Notification.create({
    recipient: deal.client._id,
    title: 'Deal Completed',
    message: `Your deal for ${deal.car.brand} ${deal.car.model} has been completed successfully.`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Deal completed successfully',
    data: { deal }
  });
});
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Vehicle from '../models/Vehicle.js';

export const getCompare = catchAsync(async (req, res, next) => {
  const user = await req.user.populate({
    path: 'compare',
    populate: {
      path: 'listing',
      match: { status: 'active' },
      select: 'price description status views'
    }
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Compare list retrieved successfully',
    data: { compare: user.compare }
  });
});

export const addToCompare = catchAsync(async (req, res, next) => {
  const { carId } = req.body;

  const vehicle = await Vehicle.findById(carId);
  if (!vehicle) {
    return next(new AppError('Car not found', 404));
  }

  if (req.user.compare.includes(carId)) {
    return next(new AppError('Car already in compare list', 400));
  }

  if (req.user.compare.length >= 4) {
    return next(new AppError('Maximum 4 cars can be compared', 400));
  }

  req.user.compare.push(carId);
  await req.user.save();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Car added to compare list',
    data: { carId }
  });
});

export const removeFromCompare = catchAsync(async (req, res, next) => {
  const { carId } = req.params;

  req.user.compare = req.user.compare.filter(
    id => id.toString() !== carId
  );
  await req.user.save();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Car removed from compare list',
    data: { carId }
  });
});
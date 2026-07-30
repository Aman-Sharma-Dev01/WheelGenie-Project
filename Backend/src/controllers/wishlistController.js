import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Vehicle from '../models/Vehicle.js';

export const getWishlist = catchAsync(async (req, res, next) => {
  const user = await req.user.populate({
    path: 'wishlist',
    populate: {
      path: 'listing',
      match: { status: 'active' },
      select: 'price description status views'
    }
  });

  const wishlist = user.wishlist.filter(v => v.status === 'active');

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Wishlist retrieved successfully',
    data: { wishlist }
  });
});

export const addToWishlist = catchAsync(async (req, res, next) => {
  const { carId } = req.params;

  const vehicle = await Vehicle.findById(carId);
  if (!vehicle) {
    return next(new AppError('Car not found', 404));
  }

  if (req.user.wishlist.includes(carId)) {
    return next(new AppError('Car already in wishlist', 400));
  }

  req.user.wishlist.push(carId);
  await req.user.save();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Car added to wishlist',
    data: { carId }
  });
});

export const removeFromWishlist = catchAsync(async (req, res, next) => {
  const { carId } = req.params;

  req.user.wishlist = req.user.wishlist.filter(
    id => id.toString() !== carId
  );
  await req.user.save();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Car removed from wishlist',
    data: { carId }
  });
});
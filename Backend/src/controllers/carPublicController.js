import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Vehicle from '../models/Vehicle.js';
import Listing from '../models/Listing.js';

export const getCars = catchAsync(async (req, res, next) => {
  const {
    page = 1, limit = 12, brand, model, fuel, transmission,
    city, minPrice, maxPrice, minYear, maxYear,
    minKms, maxKms, sort = '-createdAt', search
  } = req.query;

  const skip = (page - 1) * limit;
  const filter = { status: 'active' };

  if (brand) filter.brand = { $regex: brand, $options: 'i' };
  if (model) filter.model = { $regex: model, $options: 'i' };
  if (fuel) filter.fuel = fuel;
  if (transmission) filter.transmission = transmission;
  if (city) filter.city = { $regex: city, $options: 'i' };
  if (minPrice || maxPrice) {
    filter.$or = [
      { price: { $exists: true } },
      { 'listing.price': { $exists: true } }
    ];
  }

  let query = Vehicle.find(filter)
    .populate('owner', 'name email phone')
    .populate({
      path: 'listing',
      select: 'price description status views',
      match: { status: 'active' }
    });

  if (minPrice || maxPrice) {
    query = query.populate({
      path: 'listing',
      match: {
        status: 'active',
        price: {}
      }
    });
  }

  if (search) {
    filter.$text = { $search: search };
    query = query.sort({ score: { $meta: 'textScore' } });
  }

  const [cars, total] = await Promise.all([
    query
      .sort(sort.startsWith('-') ? sort : sort)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Vehicle.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Cars retrieved successfully',
    data: {
      cars,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const getCarById = catchAsync(async (req, res, next) => {
  const car = await Vehicle.findById(req.params.id)
    .populate('owner', 'name email phone profilePic')
    .populate({
      path: 'listing',
      select: 'price description status views createdAt',
      populate: { path: 'seller', select: 'name email phone' }
    })
    .lean();

  if (!car) {
    return next(new AppError('Car not found', 404));
  }

  if (car.listing) {
    await Listing.findByIdAndUpdate(car.listing._id, { $inc: { views: 1 } });
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Car retrieved successfully',
    data: { car }
  });
});

export const getFeaturedCars = catchAsync(async (req, res, next) => {
  const { limit = 6 } = req.query;

  const cars = await Vehicle.find({ status: 'active' })
    .populate('owner', 'name email phone')
    .populate({
      path: 'listing',
      select: 'price description status views',
      match: { status: 'active' }
    })
    .sort({ 'listing.views': -1, createdAt: -1 })
    .limit(Number(limit))
    .lean();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Featured cars retrieved successfully',
    data: { cars }
  });
});

export const getLatestCars = catchAsync(async (req, res, next) => {
  const { limit = 10 } = req.query;

  const cars = await Vehicle.find({ status: 'active' })
    .populate('owner', 'name email phone')
    .populate({
      path: 'listing',
      select: 'price description status views',
      match: { status: 'active' }
    })
    .sort({ createdAt: -1 })
    .limit(Number(limit))
    .lean();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Latest cars retrieved successfully',
    data: { cars }
  });
});

export const searchCars = catchAsync(async (req, res, next) => {
  const { q, page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;

  const cars = await Vehicle.find(
    { $text: { $search: q }, status: 'active' },
    { score: { $meta: 'textScore' } }
  )
    .populate('owner', 'name email phone')
    .populate({
      path: 'listing',
      select: 'price description status views',
      match: { status: 'active' }
    })
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await Vehicle.countDocuments({ $text: { $search: q }, status: 'active' });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Search results retrieved successfully',
    data: {
      cars,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const filterCars = catchAsync(async (req, res, next) => {
  const {
    page = 1, limit = 12, brands, fuels, transmissions,
    cities, minPrice, maxPrice, minYear, maxYear,
    minKms, maxKms, sort = '-createdAt'
  } = req.query;

  const skip = (page - 1) * limit;
  const filter = { status: 'active' };

  if (brands) filter.brand = { $in: brands.split(',') };
  if (fuels) filter.fuel = { $in: fuels.split(',') };
  if (transmissions) filter.transmission = { $in: transmissions.split(',') };
  if (cities) filter.city = { $in: cities.split(',') };
  if (minYear || maxYear) {
    filter.year = {};
    if (minYear) filter.year.$gte = Number(minYear);
    if (maxYear) filter.year.$lte = Number(maxYear);
  }
  if (minKms || maxKms) {
    filter.kms = {};
    if (minKms) filter.kms.$gte = Number(minKms);
    if (maxKms) filter.kms.$lte = Number(maxKms);
  }
  if (minPrice || maxPrice) {
    filter['listing.price'] = {};
    if (minPrice) filter['listing.price'].$gte = Number(minPrice);
    if (maxPrice) filter['listing.price'].$lte = Number(maxPrice);
  }

  const [cars, total] = await Promise.all([
    Vehicle.find(filter)
      .populate('owner', 'name email phone')
      .populate({
        path: 'listing',
        select: 'price description status views',
        match: { status: 'active' }
      })
      .sort(sort.startsWith('-') ? sort : sort)
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Vehicle.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Filtered cars retrieved successfully',
    data: {
      cars,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const getRelatedCars = catchAsync(async (req, res, next) => {
  const { limit = 4 } = req.query;
  const car = await Vehicle.findById(req.params.id).lean();

  if (!car) {
    return next(new AppError('Car not found', 404));
  }

  const relatedCars = await Vehicle.find({
    _id: { $ne: car._id },
    status: 'active',
    $or: [
      { brand: car.brand },
      { fuel: car.fuel },
      { city: car.city }
    ]
  })
    .populate('owner', 'name email phone')
    .populate({
      path: 'listing',
      select: 'price description status views',
      match: { status: 'active' }
    })
    .limit(Number(limit))
    .lean();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Related cars retrieved successfully',
    data: { cars: relatedCars }
  });
});
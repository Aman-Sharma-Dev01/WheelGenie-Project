import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Vehicle from '../models/Vehicle.js';
import Listing from '../models/Listing.js';
import SellRequest from '../models/SellRequest.js';
import Notification from '../models/Notification.js';

export const createCar = catchAsync(async (req, res, next) => {
  const {
    brand, model, variant, fuel, transmission, kms, year,
    ownership, city, images, listingPrice, listingDescription,
    sellRequestId
  } = req.body;

  const vehicle = await Vehicle.create({
    owner: req.user._id,
    brand, model, variant, fuel, transmission, kms, year,
    ownership, city, images: images || [],
    status: 'active'
  });

  let listing = null;
  if (listingPrice) {
    listing = await Listing.create({
      vehicle: vehicle._id,
      seller: req.user._id,
      price: listingPrice,
      description: listingDescription || '',
      status: 'active'
    });
    vehicle.listing = listing._id;
    await vehicle.save();
  }

  if (sellRequestId) {
    await SellRequest.findByIdAndUpdate(sellRequestId, {
      status: 'listed',
      listedVehicle: vehicle._id,
      listedListing: listing?._id
    });
  }

  const populatedVehicle = await Vehicle.findById(vehicle._id)
    .populate('owner', 'name email phone')
    .populate('listing', 'price description status views')
    .lean();

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Car created successfully',
    data: { car: populatedVehicle }
  });
});

export const getAdminCars = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, status, brand, model, search } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (status) filter.status = status;
  if (brand) filter.brand = { $regex: brand, $options: 'i' };
  if (model) filter.model = { $regex: model, $options: 'i' };
  if (search) {
    filter.$or = [
      { brand: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } },
      { variant: { $regex: search, $options: 'i' } }
    ];
  }

  const [vehicles, total] = await Promise.all([
    Vehicle.find(filter)
      .populate('owner', 'name email phone')
      .populate('listing', 'price status views')
      .sort({ createdAt: -1 })
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
      cars: vehicles,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const getCarByIdAdmin = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id)
    .populate('owner', 'name email phone address')
    .populate('listing', 'price description status views createdAt')
    .lean();

  if (!vehicle) {
    return next(new AppError('Car not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Car retrieved successfully',
    data: { car: vehicle }
  });
});

export const updateCar = catchAsync(async (req, res, next) => {
  const allowedUpdates = [
    'brand', 'model', 'variant', 'fuel', 'transmission', 'kms',
    'year', 'ownership', 'city', 'images', 'status'
  ];

  const updates = {};
  Object.keys(req.body).forEach(key => {
    if (allowedUpdates.includes(key)) updates[key] = req.body[key];
  });

  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  ).populate('owner', 'name email phone')
    .populate('listing', 'price description status views');

  if (!vehicle) {
    return next(new AppError('Car not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Car updated successfully',
    data: { car: vehicle }
  });
});

export const deleteCar = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    return next(new AppError('Car not found', 404));
  }

  if (vehicle.listing) {
    await Listing.findByIdAndDelete(vehicle.listing);
  }

  await Vehicle.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Car deleted successfully'
  });
});

export const publishCar = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id).populate('listing');

  if (!vehicle) {
    return next(new AppError('Car not found', 404));
  }

  vehicle.status = 'active';
  await vehicle.save();

  if (vehicle.listing) {
    vehicle.listing.status = 'active';
    await vehicle.listing.save();
  }

  await Notification.create({
    recipient: vehicle.owner,
    title: 'Your Car is Now Live',
    message: `Your ${vehicle.brand} ${vehicle.model} is now published and visible to buyers.`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Car published successfully',
    data: { car: vehicle }
  });
});

export const makeCarPrivate = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id).populate('listing');

  if (!vehicle) {
    return next(new AppError('Car not found', 404));
  }

  vehicle.status = 'paused';
  await vehicle.save();

  if (vehicle.listing) {
    vehicle.listing.status = 'paused';
    await vehicle.listing.save();
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Car made private successfully',
    data: { car: vehicle }
  });
});

export const archiveCar = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id).populate('listing');

  if (!vehicle) {
    return next(new AppError('Car not found', 404));
  }

  vehicle.status = 'archived';
  await vehicle.save();

  if (vehicle.listing) {
    vehicle.listing.status = 'archived';
    await vehicle.listing.save();
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Car archived successfully',
    data: { car: vehicle }
  });
});

export const markCarSold = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id).populate('listing');

  if (!vehicle) {
    return next(new AppError('Car not found', 404));
  }

  vehicle.status = 'sold';
  await vehicle.save();

  if (vehicle.listing) {
    vehicle.listing.status = 'sold';
    await vehicle.listing.save();
  }

  await Notification.create({
    recipient: vehicle.owner,
    title: 'Car Marked as Sold',
    message: `Your ${vehicle.brand} ${vehicle.model} has been marked as sold.`,
    type: 'System'
  });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Car marked as sold successfully',
    data: { car: vehicle }
  });
});

export const markCarReserved = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id).populate('listing');

  if (!vehicle) {
    return next(new AppError('Car not found', 404));
  }

  vehicle.status = 'reserved';
  await vehicle.save();

  if (vehicle.listing) {
    vehicle.listing.status = 'reserved';
    await vehicle.listing.save();
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Car marked as reserved successfully',
    data: { car: vehicle }
  });
});

export const markCarUnsold = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findById(req.params.id).populate('listing');

  if (!vehicle) {
    return next(new AppError('Car not found', 404));
  }

  vehicle.status = 'active';
  await vehicle.save();

  if (vehicle.listing) {
    vehicle.listing.status = 'active';
    await vehicle.listing.save();
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Car marked as unsold (active) successfully',
    data: { car: vehicle }
  });
});

export const addCarImages = catchAsync(async (req, res, next) => {
  const { images } = req.body;

  if (!images || !Array.isArray(images) || images.length === 0) {
    return next(new AppError('Images array is required', 400));
  }

  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    { $push: { images: { $each: images } } },
    { new: true }
  ).populate('owner', 'name email phone')
    .populate('listing', 'price description status views');

  if (!vehicle) {
    return next(new AppError('Car not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Images added successfully',
    data: { car: vehicle }
  });
});

export const deleteCarImage = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    { $pull: { images: { _id: req.params.imageId } } },
    { new: true }
  ).populate('owner', 'name email phone')
    .populate('listing', 'price description status views');

  if (!vehicle) {
    return next(new AppError('Car not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Image deleted successfully',
    data: { car: vehicle }
  });
});

export const addCarDocuments = catchAsync(async (req, res, next) => {
  const { documents } = req.body;

  if (!documents || !Array.isArray(documents) || documents.length === 0) {
    return next(new AppError('Documents array is required', 400));
  }

  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    { $push: { documents: { $each: documents } } },
    { new: true }
  ).populate('owner', 'name email phone')
    .populate('listing', 'price description status views');

  if (!vehicle) {
    return next(new AppError('Car not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Documents added successfully',
    data: { car: vehicle }
  });
});

export const deleteCarDocument = catchAsync(async (req, res, next) => {
  const vehicle = await Vehicle.findByIdAndUpdate(
    req.params.id,
    { $pull: { documents: { _id: req.params.documentId } } },
    { new: true }
  ).populate('owner', 'name email phone')
    .populate('listing', 'price description status views');

  if (!vehicle) {
    return next(new AppError('Car not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Document deleted successfully',
    data: { car: vehicle }
  });
});
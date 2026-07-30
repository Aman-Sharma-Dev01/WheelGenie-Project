import Vehicle from '../models/Vehicle.js';
import Listing from '../models/Listing.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// 1. CREATE VEHICLE & LISTING
export const createVehicleListing = catchAsync(async (req, res, next) => {
  const {
    brand,
    model,
    variant,
    fuel,
    transmission,
    kms,
    year,
    ownership,
    city,
    images,
    price,
    description
  } = req.body;

  // Create physical vehicle entry
  const newVehicle = await Vehicle.create({
    owner: req.user._id,
    brand,
    model,
    variant,
    fuel,
    transmission,
    kms,
    year,
    ownership,
    city,
    images
  });

  // Create marketplace listing referencing the vehicle
  const newListing = await Listing.create({
    vehicle: newVehicle._id,
    seller: req.user._id,
    price,
    description
  });

  // Set reverse reference on vehicle
  newVehicle.listing = newListing._id;
  await newVehicle.save();

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Vehicle listing created successfully',
    data: {
      listing: {
        ...newListing.toJSON(),
        vehicle: newVehicle
      }
    }
  });
});

// 2. GET ALL VEHICLES / LISTINGS (with Search, Filters, Sorting, Pagination)
export const getAllListings = catchAsync(async (req, res, next) => {
  const {
    brand,
    city,
    fuel,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    minKms,
    maxKms,
    search,
    sort,
    page = 1,
    limit = 10
  } = req.query;

  // Build Vehicle Filters
  const vehicleQuery = {};

  if (brand) {
    vehicleQuery.brand = { $regex: brand, $options: 'i' };
  }
  if (city) {
    vehicleQuery.city = { $regex: city, $options: 'i' };
  }
  if (fuel) {
    vehicleQuery.fuel = fuel;
  }

  // Range Queries
  if (minYear || maxYear) {
    vehicleQuery.year = {};
    if (minYear) vehicleQuery.year.$gte = Number(minYear);
    if (maxYear) vehicleQuery.year.$lte = Number(maxYear);
  }

  if (minKms || maxKms) {
    vehicleQuery.kms = {};
    if (minKms) vehicleQuery.kms.$gte = Number(minKms);
    if (maxKms) vehicleQuery.kms.$lte = Number(maxKms);
  }

  // Keyword Search on Brand / Model / Variant
  if (search) {
    vehicleQuery.$or = [
      { brand: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } },
      { variant: { $regex: search, $options: 'i' } }
    ];
  }

  // Fetch matching Vehicle IDs
  const matchingVehicles = await Vehicle.find(vehicleQuery).select('_id');
  const vehicleIds = matchingVehicles.map(v => v._id);

  // Build Listing Filters
  const listingQuery = {
    vehicle: { $in: vehicleIds },
    status: 'active' // only show active listings in catalog
  };

  if (minPrice || maxPrice) {
    listingQuery.price = {};
    if (minPrice) listingQuery.price.$gte = Number(minPrice);
    if (maxPrice) listingQuery.price.$lte = Number(maxPrice);
  }

  // Execute Count (for pagination totals)
  const totalListings = await Listing.countDocuments(listingQuery);

  // Pagination Params
  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  // Sorting Configuration
  let sortObj = { createdAt: -1 }; // Default: newest first
  if (sort === 'price') {
    sortObj = { price: 1 };
  } else if (sort === '-price') {
    sortObj = { price: -1 };
  } else if (sort === 'latest') {
    sortObj = { createdAt: -1 };
  } else if (sort === 'oldest') {
    sortObj = { createdAt: 1 };
  } else if (sort === 'popularity' || sort === 'rating') {
    sortObj = { views: -1 }; // Fallback seller ratings sort to popularity views count
  }

  // Query Database
  const listings = await Listing.find(listingQuery)
    .sort(sortObj)
    .skip(skip)
    .limit(limitNum)
    .populate('vehicle')
    .populate('seller', 'name email phone profilePic');

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Listings fetched successfully',
    pagination: {
      total: totalListings,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(totalListings / limitNum)
    },
    data: {
      listings
    }
  });
});

// 3. GET VEHICLE BY ID
export const getListingDetails = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate('vehicle')
    .populate('seller', 'name email phone profilePic');

  if (!listing) {
    return next(new AppError('No listing found with that ID', 404));
  }

  // Increment views
  listing.views += 1;
  await listing.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Listing details retrieved successfully',
    data: {
      listing
    }
  });
});

// 4. UPDATE VEHICLE & LISTING
export const updateVehicleListing = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    return next(new AppError('No listing found with that ID', 404));
  }

  // Check authorization (seller or admin)
  if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to edit this listing', 403));
  }

  // Update listing fields
  const listingFields = ['price', 'description', 'status'];
  listingFields.forEach(field => {
    if (req.body[field] !== undefined) {
      listing[field] = req.body[field];
    }
  });
  await listing.save();

  // Update vehicle fields
  const vehicleFields = [
    'brand',
    'model',
    'variant',
    'fuel',
    'transmission',
    'kms',
    'year',
    'ownership',
    'city',
    'images',
    'status'
  ];
  const vehicleUpdateData = {};
  vehicleFields.forEach(field => {
    if (req.body[field] !== undefined) {
      vehicleUpdateData[field] = req.body[field];
    }
  });

  const updatedVehicle = await Vehicle.findByIdAndUpdate(
    listing.vehicle,
    { $set: vehicleUpdateData },
    { new: true, runValidators: true }
  );

  const updatedListing = await Listing.findById(id)
    .populate('vehicle')
    .populate('seller', 'name email phone profilePic');

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Listing updated successfully',
    data: {
      listing: updatedListing
    }
  });
});

// 5. DELETE VEHICLE & LISTING
export const deleteVehicleListing = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);
  if (!listing) {
    return next(new AppError('No listing found with that ID', 404));
  }

  // Check authorization
  if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return next(new AppError('You do not have permission to delete this listing', 403));
  }

  // Remove vehicle and listing from DB
  await Vehicle.findByIdAndDelete(listing.vehicle);
  await Listing.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Listing and vehicle deleted successfully'
  });
});

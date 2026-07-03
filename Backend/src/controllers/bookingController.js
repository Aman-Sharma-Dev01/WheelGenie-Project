import Mechanic from '../models/Mechanic.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import AppError from '../utils/appError.js';
import catchAsync from '../utils/catchAsync.js';

// 1. GET ALL MECHANICS (Public)
export const getAllMechanics = catchAsync(async (req, res, next) => {
  const { city, skills, page = 1, limit = 10 } = req.query;

  const query = { isVerified: true };

  if (city) {
    query['garageAddress.city'] = { $regex: city, $options: 'i' };
  }
  if (skills) {
    query.skills = { $in: skills.split(',').map(s => new RegExp(s.trim(), 'i')) };
  }

  const pageNum = Number(page);
  const limitNum = Number(limit);
  const skip = (pageNum - 1) * limitNum;

  const total = await Mechanic.countDocuments(query);

  const mechanics = await Mechanic.find(query)
    .populate('userId', 'name email phone profilePic')
    .sort({ averageRating: -1 })
    .skip(skip)
    .limit(limitNum);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Mechanics fetched successfully',
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    },
    data: { mechanics }
  });
});

// 2. GET MECHANIC BY ID (Public)
export const getMechanicById = catchAsync(async (req, res, next) => {
  const mechanic = await Mechanic.findById(req.params.id)
    .populate('userId', 'name email phone profilePic');

  if (!mechanic) {
    return next(new AppError('No mechanic found with that ID', 404));
  }

  // Fetch reviews for this mechanic
  const reviews = await Review.find({ mechanic: mechanic._id })
    .populate('customer', 'name profilePic')
    .sort({ createdAt: -1 })
    .limit(20);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Mechanic details retrieved successfully',
    data: { mechanic, reviews }
  });
});

// 3. CREATE BOOKING (Protected - Customer)
export const createBooking = catchAsync(async (req, res, next) => {
  const { mechanicId, vehicleId, service, date } = req.body;

  // Verify mechanic exists and is available
  const mechanic = await Mechanic.findById(mechanicId);
  if (!mechanic) {
    return next(new AppError('No mechanic found with that ID', 404));
  }
  if (mechanic.availabilityStatus === 'unavailable') {
    return next(new AppError('This mechanic is currently unavailable', 400));
  }

  const booking = await Booking.create({
    customer: req.user._id,
    mechanic: mechanicId,
    vehicle: vehicleId,
    service,
    date: new Date(date)
  });

  const populatedBooking = await Booking.findById(booking._id)
    .populate('customer', 'name email phone')
    .populate('mechanic')
    .populate('vehicle');

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Booking created successfully',
    data: { booking: populatedBooking }
  });
});

// 4. GET BOOKING BY ID (Protected)
export const getBookingById = catchAsync(async (req, res, next) => {
  const booking = await Booking.findById(req.params.id)
    .populate('customer', 'name email phone profilePic')
    .populate('mechanic')
    .populate('vehicle');

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  // Only customer, the mechanic, or admin can view
  const isCustomer = booking.customer._id.toString() === req.user._id.toString();
  const isMechanic = booking.mechanic.userId && booking.mechanic.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isCustomer && !isMechanic && !isAdmin) {
    return next(new AppError('You do not have permission to view this booking', 403));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Booking details retrieved successfully',
    data: { booking }
  });
});

// 5. UPDATE BOOKING STATUS (Protected)
export const updateBookingStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;

  const booking = await Booking.findById(req.params.id);
  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  const mechanic = await Mechanic.findById(booking.mechanic);
  const isCustomer = booking.customer.toString() === req.user._id.toString();
  const isMechanic = mechanic && mechanic.userId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  // Customer can only cancel
  if (isCustomer && status !== 'Cancelled') {
    return next(new AppError('Customers can only cancel bookings', 400));
  }

  // Mechanic can accept, reject (cancel), update progress, complete
  if (!isCustomer && !isMechanic && !isAdmin) {
    return next(new AppError('You do not have permission to update this booking', 403));
  }

  booking.status = status;
  await booking.save();

  const updatedBooking = await Booking.findById(booking._id)
    .populate('customer', 'name email phone')
    .populate('mechanic')
    .populate('vehicle');

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: `Booking status updated to ${status}`,
    data: { booking: updatedBooking }
  });
});

// 6. GET MY BOOKINGS (Protected)
export const getMyBookings = catchAsync(async (req, res, next) => {
  let query = {};

  if (req.user.role === 'customer') {
    query.customer = req.user._id;
  } else if (req.user.role === 'mechanic') {
    const mechanic = await Mechanic.findOne({ userId: req.user._id });
    if (!mechanic) {
      return next(new AppError('Mechanic profile not found', 404));
    }
    query.mechanic = mechanic._id;
  } else if (req.user.role === 'admin') {
    // Admin sees all
  }

  const bookings = await Booking.find(query)
    .populate('customer', 'name email phone profilePic')
    .populate('mechanic')
    .populate('vehicle')
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Bookings fetched successfully',
    data: {
      count: bookings.length,
      bookings
    }
  });
});

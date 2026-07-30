import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import MasterData from '../models/MasterData.js';

export const getBrands = catchAsync(async (req, res, next) => {
  const { active = 'true', page = 1, limit = 50 } = req.query;
  const skip = (page - 1) * limit;

  const filter = active === 'true' ? { isActive: true } : {};

  const [brands, total] = await Promise.all([
    MasterData.Brand.find(filter)
      .sort({ displayOrder: 1, name: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    MasterData.Brand.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Brands retrieved successfully',
    data: {
      brands,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const getBrandById = catchAsync(async (req, res, next) => {
  const brand = await MasterData.Brand.findById(req.params.id).lean();

  if (!brand) {
    return next(new AppError('Brand not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Brand retrieved successfully',
    data: { brand }
  });
});

export const createBrand = catchAsync(async (req, res, next) => {
  const { name, logo, isActive, displayOrder } = req.body;

  const brand = await MasterData.Brand.create({
    name,
    logo,
    isActive,
    displayOrder
  });

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Brand created successfully',
    data: { brand }
  });
});

export const updateBrand = catchAsync(async (req, res, next) => {
  const { name, logo, isActive, displayOrder } = req.body;

  const brand = await MasterData.Brand.findByIdAndUpdate(
    req.params.id,
    { $set: { name, logo, isActive, displayOrder } },
    { new: true, runValidators: true }
  );

  if (!brand) {
    return next(new AppError('Brand not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Brand updated successfully',
    data: { brand }
  });
});

export const deleteBrand = catchAsync(async (req, res, next) => {
  const brand = await MasterData.Brand.findByIdAndDelete(req.params.id);

  if (!brand) {
    return next(new AppError('Brand not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Brand deleted successfully'
  });
});

export const getModels = catchAsync(async (req, res, next) => {
  const { brand, active = 'true', page = 1, limit = 50 } = req.query;
  const skip = (page - 1) * limit;

  const filter = active === 'true' ? { isActive: true } : {};
  if (brand) filter.brand = brand;

  const [models, total] = await Promise.all([
    MasterData.Model.find(filter)
      .populate('brand', 'name logo')
      .sort({ displayOrder: 1, name: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    MasterData.Model.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Models retrieved successfully',
    data: {
      models,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const getModelById = catchAsync(async (req, res, next) => {
  const model = await MasterData.Model.findById(req.params.id)
    .populate('brand', 'name logo')
    .lean();

  if (!model) {
    return next(new AppError('Model not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Model retrieved successfully',
    data: { model }
  });
});

export const createModel = catchAsync(async (req, res, next) => {
  const { name, brand, bodyType, isActive, displayOrder } = req.body;

  const model = await MasterData.Model.create({
    name, brand, bodyType, isActive, displayOrder
  });

  const populated = await MasterData.Model.findById(model._id)
    .populate('brand', 'name logo')
    .lean();

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Model created successfully',
    data: { model: populated }
  });
});

export const updateModel = catchAsync(async (req, res, next) => {
  const { name, brand, bodyType, isActive, displayOrder } = req.body;

  const model = await MasterData.Model.findByIdAndUpdate(
    req.params.id,
    { $set: { name, brand, bodyType, isActive, displayOrder } },
    { new: true, runValidators: true }
  ).populate('brand', 'name logo');

  if (!model) {
    return next(new AppError('Model not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Model updated successfully',
    data: { model }
  });
});

export const deleteModel = catchAsync(async (req, res, next) => {
  const model = await MasterData.Model.findByIdAndDelete(req.params.id);

  if (!model) {
    return next(new AppError('Model not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Model deleted successfully'
  });
});

export const getStates = catchAsync(async (req, res, next) => {
  const { active = 'true', page = 1, limit = 50 } = req.query;
  const skip = (page - 1) * limit;

  const filter = active === 'true' ? { isActive: true } : {};

  const [states, total] = await Promise.all([
    MasterData.State.find(filter)
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    MasterData.State.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'States retrieved successfully',
    data: {
      states,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const getStateById = catchAsync(async (req, res, next) => {
  const state = await MasterData.State.findById(req.params.id).lean();

  if (!state) {
    return next(new AppError('State not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'State retrieved successfully',
    data: { state }
  });
});

export const createState = catchAsync(async (req, res, next) => {
  const { name, code, isActive } = req.body;

  const state = await MasterData.State.create({ name, code, isActive });

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'State created successfully',
    data: { state }
  });
});

export const updateState = catchAsync(async (req, res, next) => {
  const { name, code, isActive } = req.body;

  const state = await MasterData.State.findByIdAndUpdate(
    req.params.id,
    { $set: { name, code, isActive } },
    { new: true, runValidators: true }
  );

  if (!state) {
    return next(new AppError('State not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'State updated successfully',
    data: { state }
  });
});

export const deleteState = catchAsync(async (req, res, next) => {
  const state = await MasterData.State.findByIdAndDelete(req.params.id);

  if (!state) {
    return next(new AppError('State not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'State deleted successfully'
  });
});

export const getCities = catchAsync(async (req, res, next) => {
  const { state, active = 'true', page = 1, limit = 50, search } = req.query;
  const skip = (page - 1) * limit;

  const filter = active === 'true' ? { isActive: true } : {};
  if (state) filter.state = state;
  if (search) filter.name = { $regex: search, $options: 'i' };

  const [cities, total] = await Promise.all([
    MasterData.City.find(filter)
      .populate('state', 'name code')
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    MasterData.City.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Cities retrieved successfully',
    data: {
      cities,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const getCityById = catchAsync(async (req, res, next) => {
  const city = await MasterData.City.findById(req.params.id)
    .populate('state', 'name code')
    .lean();

  if (!city) {
    return next(new AppError('City not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'City retrieved successfully',
    data: { city }
  });
});

export const createCity = catchAsync(async (req, res, next) => {
  const { name, state, coordinates } = req.body;

  const city = await MasterData.City.create({
    name, state, coordinates
  });

  const populated = await MasterData.City.findById(city._id)
    .populate('state', 'name code')
    .lean();

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'City created successfully',
    data: { city: populated }
  });
});

export const updateCity = catchAsync(async (req, res, next) => {
  const { name, state, coordinates, isActive } = req.body;

  const city = await MasterData.City.findByIdAndUpdate(
    req.params.id,
    { $set: { name, state, coordinates, isActive } },
    { new: true, runValidators: true }
  ).populate('state', 'name code');

  if (!city) {
    return next(new AppError('City not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'City updated successfully',
    data: { city }
  });
});

export const deleteCity = catchAsync(async (req, res, next) => {
  const city = await MasterData.City.findByIdAndDelete(req.params.id);

  if (!city) {
    return next(new AppError('City not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'City deleted successfully'
  });
});

export const getCitiesByState = catchAsync(async (req, res, next) => {
  const { stateId } = req.params;
  const { active = 'true' } = req.query;

  const filter = { state: stateId };
  if (active === 'true') filter.isActive = true;

  const cities = await MasterData.City.find(filter)
    .sort({ name: 1 })
    .lean();

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Cities retrieved successfully',
    data: { cities }
  });
});
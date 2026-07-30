import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import Paperwork from '../models/Paperwork.js';
import Deal from '../models/Deal.js';
import Vehicle from '../models/Vehicle.js';
import Notification from '../models/Notification.js';

export const createPaperwork = catchAsync(async (req, res, next) => {
  const { dealId } = req.body;

  const deal = await Deal.findById(dealId).populate('client').populate('car');
  if (!deal) {
    return next(new AppError('Deal not found', 404));
  }

  const existingPaperwork = await Paperwork.findOne({ deal: dealId });
  if (existingPaperwork) {
    return next(new AppError('Paperwork already exists for this deal', 400));
  }

  const paperwork = await Paperwork.create({
    deal: dealId,
    client: deal.client?._id || req.user._id,
    official: req.user._id,
    status: 'initiated'
  });

  const populatedPaperwork = await Paperwork.findById(paperwork._id)
    .populate('deal', 'agreedPrice status')
    .populate('deal.car', 'brand model variant year city')
    .populate('client', 'name email phone')
    .populate('official', 'name email')
    .lean();

  await Notification.create({
    recipient: deal.client?._id || req.user._id,
    title: 'Paperwork Initiated',
    message: `Paperwork for ${deal.car.brand} ${deal.car.model} has been initiated. Please upload required documents.`,
    type: 'System'
  });

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Paperwork created successfully',
    data: { paperwork: populatedPaperwork }
  });
});

export const getAllPaperworks = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 20, status, deal, client } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (status) filter.status = status;
  if (deal) filter.deal = deal;
  if (client) filter.client = client;

  const [paperworks, total] = await Promise.all([
    Paperwork.find(filter)
      .populate('deal', 'agreedPrice status')
      .populate('deal.car', 'brand model variant year city')
      .populate('client', 'name email phone')
      .populate('official', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean(),
    Paperwork.countDocuments(filter)
  ]);

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Paperworks retrieved successfully',
    data: {
      paperworks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit)
      }
    }
  });
});

export const getPaperworkByIdAdmin = catchAsync(async (req, res, next) => {
  const paperwork = await Paperwork.findById(req.params.id)
    .populate('deal', 'agreedPrice status milestones paymentDetails')
    .populate('deal.car', 'brand model variant year city images')
    .populate('client', 'name email phone address')
    .populate('official', 'name email phone')
    .populate('uploadedBy', 'name email')
    .populate('verifiedBy', 'name email')
    .populate('documents.uploadedBy', 'name email')
    .populate('documents.verifiedBy', 'name email')
    .lean();

  if (!paperwork) {
    return next(new AppError('Paperwork not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Paperwork retrieved successfully',
    data: { paperwork }
  });
});

export const updatePaperwork = catchAsync(async (req, res, next) => {
  const { officialNotes, documents } = req.body;

  const updateData = {};
  if (officialNotes) updateData.officialNotes = officialNotes;
  if (documents) {
    const existingPaperwork = await Paperwork.findById(req.params.id);
    if (!existingPaperwork) {
      return next(new AppError('Paperwork not found', 404));
    }
    updateData.documents = [...existingPaperwork.documents, ...documents.map(doc => ({
      ...doc,
      uploadedBy: req.user._id,
      uploadedAt: new Date()
    }))];
    updateData.status = 'documents_uploaded';
  }

  const paperwork = await Paperwork.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate('deal', 'agreedPrice status')
    .populate('deal.car', 'brand model variant year city')
    .populate('client', 'name email phone')
    .populate('official', 'name email')
    .lean();

  if (!paperwork) {
    return next(new AppError('Paperwork not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Paperwork updated successfully',
    data: { paperwork }
  });
});

export const uploadDocument = catchAsync(async (req, res, next) => {
  const { name, type, url, publicId } = req.body;

  const paperwork = await Paperwork.findByIdAndUpdate(
    req.params.id,
    {
      $push: {
        documents: {
          name,
          type,
          url,
          publicId,
          uploadedBy: req.user._id,
          uploadedAt: new Date()
        }
      },
      status: 'documents_uploaded'
    },
    { new: true, runValidators: true }
  )
    .populate('deal', 'agreedPrice status')
    .populate('deal.car', 'brand model variant year city')
    .populate('client', 'name email phone')
    .populate('official', 'name email')
    .lean();

  if (!paperwork) {
    return next(new AppError('Paperwork not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Document uploaded successfully',
    data: { paperwork }
  });
});

export const deleteDocument = catchAsync(async (req, res, next) => {
  const paperwork = await Paperwork.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate({ path: 'deal', select: 'agreedPrice status', populate: { path: 'car', select: 'brand model variant year city' } })
    .populate('client', 'name email phone')
    .populate('official', 'name email')
    .lean();

  if (!paperwork) {
    return next(new AppError('Paperwork not found', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Document deleted successfully',
    data: { paperwork }
  });
});

export const updatePaperworkStatus = catchAsync(async (req, res, next) => {
  const { status, officialNotes } = req.body;

  const validStatuses = ['initiated', 'documents_uploaded', 'under_review', 'client_action_required', 'completed', 'rejected'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status', 400));
  }

  const updateData = { status };
  if (officialNotes) updateData.officialNotes = officialNotes;
  if (status === 'completed') {
    updateData.completedAt = new Date();
    updateData.completedBy = req.user._id;
  }

  const paperwork = await Paperwork.findByIdAndUpdate(
    req.params.id,
    { $set: updateData },
    { new: true, runValidators: true }
  )
    .populate({ path: 'deal', select: 'agreedPrice status', populate: { path: 'car', select: 'brand model variant year city' } })
    .populate('client', 'name email phone')
    .populate('official', 'name email')
    .lean();

  if (!paperwork) {
    return next(new AppError('Paperwork not found', 404));
  }

  let notificationTitle = '';
  let notificationMessage = '';

  switch (status) {
    case 'under_review':
      notificationTitle = 'Paperwork Under Review';
      notificationMessage = `Your paperwork for ${paperwork.deal.car.brand} ${paperwork.deal.car.model} is under review.`;
      break;
    case 'client_action_required':
      notificationTitle = 'Action Required on Paperwork';
      notificationMessage = `Your action is required on paperwork for ${paperwork.deal.car.brand} ${paperwork.deal.car.model}.`;
      break;
    case 'completed':
      notificationTitle = 'Paperwork Completed';
      notificationMessage = `All paperwork for ${paperwork.deal.car.brand} ${paperwork.deal.car.model} has been completed.`;
      break;
    case 'rejected':
      notificationTitle = 'Paperwork Rejected';
      notificationMessage = `Your paperwork for ${paperwork.deal.car.brand} ${paperwork.deal.car.model} was rejected. Please contact support.`;
      break;
  }

  if (notificationTitle) {
    await Notification.create({
      recipient: paperwork.client?._id || req.user._id,
      title: notificationTitle,
      message: notificationMessage,
      type: 'System'
    });
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Paperwork status updated successfully',
    data: { paperwork }
  });
});
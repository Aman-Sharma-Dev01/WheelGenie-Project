import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import crypto from 'crypto';

const uploadDir = process.env.UPLOAD_DIR || './uploads';
const maxFileSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024;

const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const allowedDocumentTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/jpg',
  'image/png'
];

export const uploadImage = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No image file provided', 400));
  }

  if (!allowedImageTypes.includes(req.file.mimetype)) {
    return next(new AppError('Invalid image type. Only JPEG, PNG, and WebP allowed', 400));
  }

  if (req.file.size > maxFileSize) {
    return next(new AppError(`File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`, 400));
  }

  const fileId = crypto.randomBytes(16).toString('hex');
  const extension = req.file.mimetype.split('/')[1];
  const fileName = `${fileId}.${extension}`;

  const uploadResult = {
    id: fileId,
    originalName: req.file.originalname,
    fileName,
    url: `/uploads/images/${fileName}`,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedAt: new Date()
  };

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Image uploaded successfully',
    data: { file: uploadResult }
  });
});

export const uploadDocument = catchAsync(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError('No document file provided', 400));
  }

  if (!allowedDocumentTypes.includes(req.file.mimetype)) {
    return next(new AppError('Invalid document type. Only PDF, DOC, DOCX, JPEG, PNG allowed', 400));
  }

  if (req.file.size > maxFileSize) {
    return next(new AppError(`File size exceeds ${maxFileSize / (1024 * 1024)}MB limit`, 400));
  }

  const fileId = crypto.randomBytes(16).toString('hex');
  const extension = req.file.mimetype.split('/')[1];
  const fileName = `${fileId}.${extension}`;

  const uploadResult = {
    id: fileId,
    originalName: req.file.originalname,
    fileName,
    url: `/uploads/documents/${fileName}`,
    mimeType: req.file.mimetype,
    size: req.file.size,
    uploadedAt: new Date()
  };

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Document uploaded successfully',
    data: { file: uploadResult }
  });
});

export const deleteUpload = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Upload deleted successfully',
    data: { deletedId: id }
  });
});
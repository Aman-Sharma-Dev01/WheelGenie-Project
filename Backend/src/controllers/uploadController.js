import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';
import crypto from 'crypto';

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

  const publicId = `${crypto.randomBytes(16).toString('hex')}`;
  const result = await uploadToCloudinary(req.file.buffer, {
    folder: 'wheelgenie/images',
    publicId,
    resourceType: 'image',
  });

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Image uploaded successfully',
    data: {
      file: {
        id: result.public_id,
        url: result.secure_url,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        width: result.width,
        height: result.height,
        format: result.format,
        uploadedAt: new Date()
      }
    }
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

  const publicId = `${crypto.randomBytes(16).toString('hex')}`;
  const result = await uploadToCloudinary(req.file.buffer, {
    folder: 'wheelgenie/documents',
    publicId,
    resourceType: 'auto',
  });

  res.status(201).json({
    success: true,
    statusCode: 201,
    message: 'Document uploaded successfully',
    data: {
      file: {
        id: result.public_id,
        url: result.secure_url,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        format: result.format,
        uploadedAt: new Date()
      }
    }
  });
});

export const deleteUpload = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let result;
  try {
    result = await deleteFromCloudinary(id);
  } catch (err) {
    return next(new AppError('Failed to delete file from Cloudinary', 500));
  }

  if (result.result === 'not found') {
    return next(new AppError('File not found on Cloudinary', 404));
  }

  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'File deleted successfully from Cloudinary',
    data: { deletedId: id }
  });
});

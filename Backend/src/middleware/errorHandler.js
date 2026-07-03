import { ZodError } from 'zod';
import AppError from '../utils/appError.js';

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const match = err.errmsg?.match?.(/(['"])(\\?.)*?\1/) || err.message?.match?.(/dup key: \{ (.+?) \}/);
  const value = match ? match[0] : '';
  const message = `Duplicate field value: ${value || 'record'}. Please use another value!`;
  return new AppError(message, 409);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () => new AppError('Your token has expired! Please log in again.', 401);

const handleZodError = (err) => {
  const zodIssues = err.issues || err.errors || [];
  const errors = zodIssues.map((e) => ({
    field: e.path.slice(1).join('.'),
    message: e.message
  }));
  return new AppError('Validation failed', 400, errors);
};

// Classify error into operational AppError regardless of environment
const classifyError = (err) => {
  let error = err;
  if (err.name === 'CastError') error = handleCastErrorDB(err);
  else if (err.code === 11000) error = handleDuplicateFieldsDB(err);
  else if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
  else if (err.name === 'JsonWebTokenError') error = handleJWTError();
  else if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
  else if (err instanceof ZodError) error = handleZodError(err);
  return error;
};

const sendErrorDev = (err, req, res) => {
  return res.status(err.statusCode).json({
    success: false,
    statusCode: err.statusCode,
    message: err.message,
    errors: err.errors || null,
    stack: err.stack
  });
};

const sendErrorProd = (err, req, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors || null
    });
  }

  // Programming/system errors: don't leak details to client
  console.error('ERROR 💥', err);
  return res.status(500).json({
    success: false,
    statusCode: 500,
    message: 'Something went wrong!'
  });
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Classify the error in both environments
  const error = classifyError(err);

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, req, res);
  } else {
    sendErrorProd(error, req, res);
  }
};

export default errorHandler;

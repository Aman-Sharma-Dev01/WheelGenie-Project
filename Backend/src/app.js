import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import marketplaceRoutes from './routes/marketplaceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import valuationRoutes from './routes/valuationRoutes.js';

// Middleware & Utility Imports
import errorHandler from './middleware/errorHandler.js';
import AppError from './utils/appError.js';
import { setupSwagger } from './config/swagger.js';

const app = express();

// Global Middlewares
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Swagger API Documentation
setupSwagger(app);

// Base Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Welcome to WheelGenie API Backend!',
    documentation: '/api-docs'
  });
});

// Health Route
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    statusCode: 200,
    message: 'Server is healthy',
    timestamp: new Date()
  });
});

// Mount Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', marketplaceRoutes);
app.use('/api/v1', bookingRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/valuation', valuationRoutes);

// Unhandled route handler
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized Global Error Handler
app.use(errorHandler);

export default app;

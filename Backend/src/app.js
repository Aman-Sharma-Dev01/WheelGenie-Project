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
import clientRoutes from './routes/clientRoutes.js';
import sellRequestRoutes from './routes/sellRequestRoutes.js';
import sellRequestAdminRoutes from './routes/sellRequestAdminRoutes.js';
import inspectionRoutes from './routes/inspectionRoutes.js';
import meetingRoutes from './routes/meetingRoutes.js';
import meetingClientRoutes from './routes/meetingClientRoutes.js';
import carPublicRoutes from './routes/carPublicRoutes.js';
import carAdminRoutes from './routes/carAdminRoutes.js';
import testDriveClientRoutes from './routes/testDriveClientRoutes.js';
import testDriveAdminRoutes from './routes/testDriveAdminRoutes.js';
import inquiryClientRoutes from './routes/inquiryClientRoutes.js';
import inquiryAdminRoutes from './routes/inquiryAdminRoutes.js';
import dealClientRoutes from './routes/dealClientRoutes.js';
import dealAdminRoutes from './routes/dealAdminRoutes.js';
import paperworkClientRoutes from './routes/paperworkClientRoutes.js';
import paperworkAdminRoutes from './routes/paperworkAdminRoutes.js';
import timelineRoutes from './routes/timelineRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import masterDataRoutes from './routes/masterDataRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import compareRoutes from './routes/compareRoutes.js';
import adminUserRoutes from './routes/adminUserRoutes.js';

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
app.use('/api/v1/client', clientRoutes);
app.use('/api/v1/sell-requests', sellRequestRoutes);
app.use('/api/v1/admin/sell-requests', sellRequestAdminRoutes);
app.use('/api/v1/inspections', inspectionRoutes);
app.use('/api/v1/meetings', meetingClientRoutes);
app.use('/api/v1/admin/meetings', meetingRoutes);
app.use('/api/v1/cars', carPublicRoutes);
app.use('/api/v1/admin/cars', carAdminRoutes);
app.use('/api/v1/test-drives', testDriveClientRoutes);
app.use('/api/v1/admin/test-drives', testDriveAdminRoutes);
app.use('/api/v1/inquiries', inquiryClientRoutes);
app.use('/api/v1/admin/inquiries', inquiryAdminRoutes);
app.use('/api/v1/deals', dealClientRoutes);
app.use('/api/v1/admin/deals', dealAdminRoutes);
app.use('/api/v1/paperworks', paperworkClientRoutes);
app.use('/api/v1/admin/paperworks', paperworkAdminRoutes);
app.use('/api/v1/timeline', timelineRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/uploads', uploadRoutes);
app.use('/api/v1/master', masterDataRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/compare', compareRoutes);
app.use('/api/v1/admin/users', adminUserRoutes);

// Unhandled route handler
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Centralized Global Error Handler
app.use(errorHandler);

export default app;

import app from './app.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

dotenv.config();

// Connect to Database
connectDB();

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  WheelGenie Server running on port ${PORT} `);
  console.log(`  Environment: ${process.env.NODE_ENV || 'development'} `);
  console.log(`=========================================`);
});

// Handle unhandled rejections and exceptions gracefully
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! Shutting down...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err);
  process.exit(1);
});

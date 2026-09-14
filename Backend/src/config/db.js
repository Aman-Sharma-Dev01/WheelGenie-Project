import mongoose from 'mongoose';

const connectDB = async () => {
  const atlasUri = process.env.MONGODB_URI;
  const localUri = 'mongodb://127.0.0.1:27017/wheelgenie';

  if (atlasUri && !atlasUri.includes('127.0.0.1') && !atlasUri.includes('localhost')) {
    try {
      console.log('Connecting to MongoDB Atlas...');
      const conn = await mongoose.connect(atlasUri, { serverSelectionTimeoutMS: 3500 });
      console.log(`MongoDB Connected (Atlas): ${conn.connection.host}`);
      return;
    } catch (error) {
      console.warn(`[WARNING] MongoDB Atlas connection failed (${error.message}).`);
      console.warn('Falling back to local MongoDB server on port 27017...');
    }
  }

  try {
    const conn = await mongoose.connect(localUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`MongoDB Connected (Local): ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

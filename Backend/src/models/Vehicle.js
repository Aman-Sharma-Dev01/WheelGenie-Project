import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true,
    index: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true,
    index: true
  },
  variant: {
    type: String,
    required: [true, 'Variant is required'],
    trim: true
  },
  fuel: {
    type: String,
    enum: ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'],
    required: [true, 'Fuel type is required']
  },
  transmission: {
    type: String,
    enum: ['Manual', 'Automatic'],
    required: [true, 'Transmission type is required']
  },
  kms: {
    type: Number,
    required: [true, 'Kilometers run is required'],
    min: [0, 'Kilometers cannot be negative']
  },
  year: {
    type: Number,
    required: [true, 'Manufacturing year is required'],
    min: [1901, 'Invalid year'],
    max: [new Date().getFullYear() + 1, 'Invalid year']
  },
  ownership: {
    type: Number,
    required: [true, 'Ownership number is required'],
    min: [1, 'Ownership cannot be less than 1']
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true,
    index: true
  },
  images: [{
    type: String,
    required: true
  }],
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing'
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'paused', 'draft', 'archived', 'reserved'],
    default: 'active'
  }
}, {
  timestamps: true
});

vehicleSchema.index({ brand: 'text', model: 'text', variant: 'text' });

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;

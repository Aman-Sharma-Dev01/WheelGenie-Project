import mongoose from 'mongoose';

const sellRequestSchema = new mongoose.Schema({
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Client is required'],
    index: true
  },
  brand: {
    type: String,
    required: [true, 'Brand is required'],
    trim: true
  },
  model: {
    type: String,
    required: [true, 'Model is required'],
    trim: true
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
    trim: true
  },
  expectedPrice: {
    type: Number,
    min: [0, 'Expected price cannot be negative']
  },
  description: {
    type: String,
    trim: true
  },
  images: [{
    url: { type: String, required: true },
    publicId: { type: String }
  }],
  documents: [{
    name: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['RC', 'Insurance', 'PUC', 'ServiceHistory', 'Other'],
      required: true 
    },
    url: { type: String, required: true },
    publicId: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['pending', 'inspection_scheduled', 'inspection_completed', 'approved', 'rejected', 'listed', 'cancelled'],
    default: 'pending',
    index: true
  },
  inspectionDate: { type: Date },
  inspectionNotes: { type: String },
  inspectedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  officialNotes: { type: String },
  rejectionReason: { type: String },
  listedVehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  listedListing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
  cancelledAt: { type: Date },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

sellRequestSchema.index({ client: 1, status: 1 });
sellRequestSchema.index({ status: 1, createdAt: -1 });

const SellRequest = mongoose.model('SellRequest', sellRequestSchema);
export default SellRequest;
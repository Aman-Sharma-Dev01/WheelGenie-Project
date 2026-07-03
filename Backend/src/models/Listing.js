import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle reference is required'],
    unique: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller is required']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    index: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'paused'],
    default: 'active',
    index: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const Listing = mongoose.model('Listing', listingSchema);
export default Listing;

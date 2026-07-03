import mongoose from 'mongoose';

const mechanicSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required'],
    unique: true
  },
  experience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  skills: [{
    type: String,
    trim: true
  }],
  garageAddress: {
    street: { type: String, required: [true, 'Garage street address is required'] },
    city: { type: String, required: [true, 'Garage city is required'], index: true },
    state: { type: String, required: [true, 'Garage state is required'] },
    zipCode: { type: String, required: [true, 'Garage ZIP code is required'] }
  },
  averageRating: {
    type: Number,
    default: 0,
    min: [0, 'Rating cannot be less than 0'],
    max: [5, 'Rating cannot be more than 5']
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  availabilityStatus: {
    type: String,
    enum: ['available', 'unavailable'],
    default: 'available'
  },
  availabilitySlots: [{
    type: String
  }],
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Mechanic = mongoose.model('Mechanic', mechanicSchema);
export default Mechanic;

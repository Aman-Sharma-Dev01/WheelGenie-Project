import mongoose from 'mongoose';

const compareSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
    index: true
  },
  cars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle'
  }],
  maxCars: {
    type: Number,
    default: 3
  }
}, {
  timestamps: true
});

compareSchema.index({ user: 1 }, { unique: true });

const Compare = mongoose.model('Compare', compareSchema);
export default Compare;
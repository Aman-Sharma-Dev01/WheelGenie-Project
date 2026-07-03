import mongoose from 'mongoose';

const serviceHistorySchema = new mongoose.Schema({
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle reference is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner reference is required']
  },
  serviceType: {
    type: String,
    enum: ['Oil Change', 'Repair', 'Parts Replacement', 'General Inspection', 'Other'],
    required: [true, 'Service type is required']
  },
  serviceDate: {
    type: Date,
    required: [true, 'Service date is required'],
    default: Date.now
  },
  partsReplaced: [{
    type: String,
    trim: true
  }],
  cost: {
    type: Number,
    min: [0, 'Cost cannot be negative'],
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  performedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mechanic'
  },
  nextServiceReminder: {
    type: Date
  }
}, {
  timestamps: true
});

const ServiceHistory = mongoose.model('ServiceHistory', serviceHistorySchema);
export default ServiceHistory;

import mongoose from 'mongoose';

const testDriveSchema = new mongoose.Schema({
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Car is required'],
    index: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Client is required'],
    index: true
  },
  official: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required'],
    index: true
  },
  durationMinutes: {
    type: Number,
    default: 30,
    min: [15, 'Minimum duration is 15 minutes'],
    max: [120, 'Maximum duration is 2 hours']
  },
  status: {
    type: String,
    enum: ['requested', 'approved', 'rejected', 'scheduled', 'in_progress', 'completed', 'cancelled', 'rescheduled'],
    default: 'requested',
    index: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point', 'physical'],
      default: 'physical'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: { type: String },
    venue: { 
      type: String, 
      enum: ['wheelgenie_center', 'dealership', 'client_location', 'other'],
      default: 'wheelgenie_center'
    }
  },
  notes: { type: String },
  officialNotes: { type: String },
  clientFeedback: { type: String },
  rating: { type: Number, min: 1, max: 5 },
  rescheduleHistory: [{
    previousDate: { type: Date },
    newDate: { type: Date },
    reason: { type: String },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    requestedAt: { type: Date, default: Date.now }
  }],
  cancellationReason: { type: String },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  completedAt: { type: Date },
  reminderSent: { type: Boolean, default: false }
}, {
  timestamps: true
});

testDriveSchema.index({ car: 1, status: 1 });
testDriveSchema.index({ client: 1, status: 1 });
testDriveSchema.index({ official: 1, status: 1 });
testDriveSchema.index({ scheduledDate: 1, status: 1 });

const TestDrive = mongoose.model('TestDrive', testDriveSchema);
export default TestDrive;
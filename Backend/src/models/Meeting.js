import mongoose from 'mongoose';

const meetingSchema = new mongoose.Schema({
  sellRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SellRequest',
    required: [true, 'Sell request is required'],
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
    required: [true, 'Official is required'],
    index: true
  },
  type: {
    type: String,
    enum: ['inspection', 'test_drive', 'handover', 'document_verification', 'other'],
    default: 'inspection',
    index: true
  },
  scheduledDate: {
    type: Date,
    required: [true, 'Scheduled date is required'],
    index: true
  },
  durationMinutes: {
    type: Number,
    default: 60,
    min: [15, 'Minimum duration is 15 minutes'],
    max: [480, 'Maximum duration is 8 hours']
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'rejected', 'rescheduled'],
    default: 'scheduled',
    index: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point', 'physical', 'virtual'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    },
    address: { type: String },
    venue: { 
      type: String, 
      enum: ['wheelgenie_center', 'client_location', 'dealership', 'virtual', 'other'],
      default: 'wheelgenie_center'
    },
    meetingLink: { type: String }
  },
  notes: { type: String },
  officialNotes: { type: String },
  clientFeedback: { type: String },
  officialFeedback: { type: String },
  completedAt: { type: Date },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cancellationReason: { type: String },
  rescheduledFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' },
  rescheduledTo: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' }
}, {
  timestamps: true
});

meetingSchema.index({ sellRequest: 1, status: 1 });
meetingSchema.index({ official: 1, scheduledDate: 1 });
meetingSchema.index({ client: 1, scheduledDate: 1 });
meetingSchema.index({ status: 1, scheduledDate: 1 });

const Meeting = mongoose.model('Meeting', meetingSchema);
export default Meeting;
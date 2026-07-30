import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000
  },
  isOfficial: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const inquirySchema = new mongoose.Schema({
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
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    maxlength: 200
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    maxlength: 2000
  },
  status: {
    type: String,
    enum: ['open', 'in_progress', 'replied', 'closed'],
    default: 'open',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  replies: [replySchema],
  closedAt: { type: Date },
  closedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

inquirySchema.index({ car: 1, status: 1 });
inquirySchema.index({ client: 1, status: 1 });
inquirySchema.index({ official: 1, status: 1 });
inquirySchema.index({ createdAt: -1 });

const Inquiry = mongoose.model('Inquiry', inquirySchema);
export default Inquiry;
import mongoose from 'mongoose';

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date }
});

const paymentDetailsSchema = new mongoose.Schema({
  amount: { type: Number, min: 0 },
  method: { type: String, enum: ['cash', 'bank_transfer', 'cheque', 'loan', 'other'] },
  receivedAt: { type: Date },
  reference: { type: String },
  notes: { type: String }
});

const dealSchema = new mongoose.Schema({
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
  sellRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SellRequest'
  },
  agreedPrice: {
    type: Number,
    required: [true, 'Agreed price is required'],
    min: [0, 'Price cannot be negative']
  },
  milestones: [milestoneSchema],
  paymentDetails: paymentDetailsSchema,
  status: {
    type: String,
    enum: ['draft', 'pending_payment', 'payment_received', 'documents_pending', 'completed', 'cancelled'],
    default: 'draft',
    index: true
  },
  cancellationReason: { type: String },
  cancelledAt: { type: Date },
  cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  completedAt: { type: Date }
}, {
  timestamps: true
});

dealSchema.index({ car: 1, status: 1 });
dealSchema.index({ client: 1, status: 1 });
dealSchema.index({ official: 1, status: 1 });
dealSchema.index({ createdAt: -1 });

const Deal = mongoose.model('Deal', dealSchema);
export default Deal;
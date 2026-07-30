import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['sale_agreement', 'rc_transfer', 'insurance_transfer', 'noc', 'payment_receipt', 'loan_documents', 'delivery_receipt', 'other'],
    required: true
  },
  url: { type: String, required: true },
  publicId: { type: String },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  uploadedAt: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  verifiedAt: { type: Date },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

const paperworkSchema = new mongoose.Schema({
  deal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deal',
    required: [true, 'Deal is required'],
    unique: true,
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
  documents: [documentSchema],
  status: {
    type: String,
    enum: ['initiated', 'documents_uploaded', 'under_review', 'client_action_required', 'completed', 'rejected'],
    default: 'initiated',
    index: true
  },
  officialNotes: { type: String, maxlength: 2000 },
  clientNotes: { type: String, maxlength: 2000 },
  completedAt: { type: Date },
  completedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

paperworkSchema.index({ deal: 1, status: 1 });
paperworkSchema.index({ client: 1, status: 1 });
paperworkSchema.index({ official: 1, status: 1 });

const Paperwork = mongoose.model('Paperwork', paperworkSchema);
export default Paperwork;
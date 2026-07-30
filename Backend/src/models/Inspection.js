import mongoose from 'mongoose';

const inspectionSchema = new mongoose.Schema({
  sellRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SellRequest',
    required: [true, 'Sell request is required'],
    unique: true,
    index: true
  },
  inspectedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['scheduled', 'in_progress', 'completed', 'cancelled'],
    default: 'scheduled',
    index: true
  },
  scheduledDate: { type: Date },
  completedDate: { type: Date },
  
  exterior: {
    bodyCondition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    paintCondition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    rustDamage: { type: String, enum: ['none', 'minor', 'moderate', 'severe'] },
    dentsScratches: { type: String, enum: ['none', 'minor', 'moderate', 'severe'] },
    glassCondition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    lightsCondition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    tyresCondition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    notes: { type: String }
  },
  
  interior: {
    seatsCondition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    dashboardCondition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    electronicsWorking: { type: Boolean },
    acHeatingWorking: { type: Boolean },
    odometerReading: { type: Number },
    notes: { type: String }
  },
  
  mechanical: {
    engineCondition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    transmissionCondition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    suspensionCondition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    brakesCondition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    steeringCondition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    exhaustCondition: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    fluidLevels: { type: String, enum: ['good', 'low', 'needs_change'] },
    notes: { type: String }
  },
  
  testDrive: {
    performed: { type: Boolean, default: false },
    enginePerformance: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    transmissionPerformance: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    brakePerformance: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    steeringPerformance: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
    noiseVibration: { type: String, enum: ['none', 'minor', 'moderate', 'severe'] },
    notes: { type: String }
  },
  
  documents: {
    rcVerified: { type: Boolean, default: false },
    insuranceVerified: { type: Boolean, default: false },
    pucVerified: { type: Boolean, default: false },
    serviceHistoryVerified: { type: Boolean, default: false },
    ownershipVerified: { type: Boolean, default: false },
    notes: { type: String }
  },
  
  images: [{
    category: {
      type: String,
      enum: ['exterior', 'interior', 'mechanical', 'documents', 'damage', 'other'],
      required: true
    },
    url: { type: String, required: true },
    publicId: { type: String },
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  reportUrl: { type: String },
  reportPublicId: { type: String },
  
  overallRating: { type: String, enum: ['excellent', 'good', 'fair', 'poor'] },
  estimatedValue: { type: Number, min: 0 },
  recommendation: { type: String, enum: ['accept_as_is', 'accept_with_repairs', 'reject'] },
  repairEstimate: { type: Number, min: 0 },
  officialNotes: { type: String }
}, {
  timestamps: true
});

inspectionSchema.index({ sellRequest: 1 });
inspectionSchema.index({ inspectedBy: 1, status: 1 });
inspectionSchema.index({ status: 1, scheduledDate: 1 });

const Inspection = mongoose.model('Inspection', inspectionSchema);
export default Inspection;
import mongoose from 'mongoose';

const aiEvaluationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  inputData: {
    brand: { type: String, required: true },
    model: { type: String, required: true },
    variant: { type: String, required: true },
    year: { type: Number, required: true },
    fuel: { type: String, required: true },
    kms: { type: Number, required: true },
    ownership: { type: Number, required: true },
    accidentHistory: { type: String, default: 'None' },
    city: { type: String, required: true },
    askingPrice: { type: Number, required: true }
  },
  evaluation: {
    estimatedMarketPrice: { type: Number },
    priceRange: {
      min: { type: Number },
      max: { type: Number }
    },
    isAskingPriceFair: { type: Boolean },
    hiddenRisks: [{ type: String }],
    maintenanceCostPrediction: { type: String },
    ownershipRecommendation: { type: String },
    resaleValue: { type: Number },
    futureDepreciation: [{
      year: { type: Number },
      value: { type: Number }
    }],
    overallRating: { type: Number, min: 1, max: 10 },
    pros: [{ type: String }],
    cons: [{ type: String }],
    buyAvoidRecommendation: {
      type: String,
      enum: ['Buy', 'Avoid', 'Proceed with Caution']
    }
  }
}, {
  timestamps: true
});

const AIEvaluation = mongoose.model('AIEvaluation', aiEvaluationSchema);
export default AIEvaluation;

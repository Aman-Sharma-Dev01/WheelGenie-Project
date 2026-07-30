import mongoose from 'mongoose';

const brandSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  logo: { type: String },
  isActive: { type: Boolean, default: true, index: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

const modelSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true, index: true },
  bodyType: { type: String, enum: ['sedan', 'hatchback', 'suv', 'muv', 'coupe', 'convertible', 'wagon', 'pickup', 'van'] },
  isActive: { type: Boolean, default: true, index: true },
  displayOrder: { type: Number, default: 0 }
}, { timestamps: true });

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true, minlength: 2, maxlength: 3 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const citySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  state: { type: mongoose.Schema.Types.ObjectId, ref: 'State', required: true, index: true },
  isActive: { type: Boolean, default: true, index: true },
  coordinates: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  }
}, { timestamps: true });

citySchema.index({ name: 1, state: 1 }, { unique: true });

const MasterData = {
  Brand: mongoose.model('Brand', brandSchema),
  Model: mongoose.model('Model', modelSchema),
  State: mongoose.model('State', stateSchema),
  City: mongoose.model('City', citySchema)
};

export default MasterData;
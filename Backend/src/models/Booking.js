import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  mechanic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mechanic',
    required: [true, 'Mechanic is required']
  },
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: [true, 'Vehicle is required']
  },
  service: {
    type: String,
    required: [true, 'Service description is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Booking date and time are required']
  },
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'On The Way', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending',
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;

import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Recipient is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Booking', 'Service', 'System', 'Promotion'],
    default: 'System'
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;

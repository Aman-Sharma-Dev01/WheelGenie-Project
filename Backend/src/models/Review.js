import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
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
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5'],
    required: [true, 'Rating is required']
  },
  comment: {
    type: String,
    required: [true, 'Comment is required'],
    trim: true
  }
}, {
  timestamps: true
});

// Enforce unique review per booking by a customer
reviewSchema.index({ customer: 1, booking: 1 }, { unique: true, sparse: true });

// Static method to calculate average rating of a mechanic
reviewSchema.statics.calculateAverageRating = async function (mechanicId) {
  const stats = await this.aggregate([
    {
      $match: { mechanic: mechanicId }
    },
    {
      $group: {
        _id: '$mechanic',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  const Mechanic = mongoose.model('Mechanic');
  if (stats.length > 0) {
    await Mechanic.findByIdAndUpdate(mechanicId, {
      totalReviews: stats[0].nRating,
      averageRating: Math.round(stats[0].avgRating * 10) / 10
    });
  } else {
    await Mechanic.findByIdAndUpdate(mechanicId, {
      totalReviews: 0,
      averageRating: 0
    });
  }
};

// Update mechanic ratings after saving a review
reviewSchema.post('save', function () {
  this.constructor.calculateAverageRating(this.mechanic);
});

// Update mechanic ratings after deleting a review
reviewSchema.post(/^findOneAnd/, async function (doc) {
  if (doc) {
    await doc.constructor.calculateAverageRating(doc.mechanic);
  }
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;

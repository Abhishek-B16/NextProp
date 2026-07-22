const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Review must refer to a property']
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    },
    comment: {
      type: String,
      required: [true, 'Please provide a review comment'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate reviews: Only 1 review per customer per property
reviewSchema.index({ property: 1, user: 1 }, { unique: true });

// Static method to calculate average rating & review count for a property
reviewSchema.statics.calcAverageRating = async function (propertyId) {
  try {
    const stats = await this.aggregate([
      {
        $match: { property: new mongoose.Types.ObjectId(propertyId) }
      },
      {
        $group: {
          _id: '$property',
          numOfReviews: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      }
    ]);

    const Property = mongoose.model('Property');

    if (stats.length > 0) {
      await Property.findByIdAndUpdate(propertyId, {
        averageRating: Math.round(stats[0].avgRating * 10) / 10,
        numOfReviews: stats[0].numOfReviews
      });
      console.log(`⭐ Updated Property ${propertyId} Avg Rating: ${Math.round(stats[0].avgRating * 10) / 10} (${stats[0].numOfReviews} reviews)`);
    } else {
      await Property.findByIdAndUpdate(propertyId, {
        averageRating: 0,
        numOfReviews: 0
      });
      console.log(`⭐ Reset Property ${propertyId} Avg Rating: 0 (0 reviews)`);
    }
  } catch (error) {
    console.error('❌ Error calculating average rating:', error.message);
  }
};

// Post-save hook to calculate average rating automatically
reviewSchema.post('save', function () {
  this.constructor.calcAverageRating(this.property);
});

// Post-delete hook to recalculate average rating automatically
reviewSchema.post('findOneAndDelete', function (doc) {
  if (doc) {
    doc.constructor.calcAverageRating(doc.property);
  }
});

reviewSchema.post('deleteOne', { document: true, query: false }, function () {
  this.constructor.calcAverageRating(this.property);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;

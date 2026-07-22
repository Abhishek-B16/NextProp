const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Wishlist item must belong to a user']
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Wishlist item must refer to a property']
    }
  },
  {
    timestamps: true
  }
);

// Composite Unique Index to strictly prevent duplicate wishlist entries per user
wishlistSchema.index({ user: 1, property: 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

module.exports = Wishlist;

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must be associated with a customer']
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must be associated with a property owner']
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: [true, 'Booking must be associated with a property']
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'],
        message: 'Status must be pending, accepted, rejected, completed, or cancelled'
      },
      default: 'pending'
    },
    visitDate: {
      type: Date,
      required: [true, 'Please specify a visit date']
    },
    message: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast lookup of customer/owner booking requests
bookingSchema.index({ customer: 1, status: 1 });
bookingSchema.index({ owner: 1, status: 1 });
bookingSchema.index({ property: 1, customer: 1, visitDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;

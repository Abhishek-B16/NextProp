const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Notification must have a recipient']
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    type: {
      type: String,
      enum: {
        values: ['booking_update', 'new_review', 'new_message', 'system'],
        message: 'Invalid notification type'
      },
      required: [true, 'Notification must have a type']
    },
    title: {
      type: String,
      required: [true, 'Notification must have a title'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Notification must have a message'],
      trim: true
    },
    read: {
      type: Boolean,
      default: false
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

// Indexes for fast unread notifications queries
notificationSchema.index({ recipient: 1, read: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;

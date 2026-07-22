const Notification = require('../models/Notification');
const { emitToUser } = require('./socket');

/**
 * Utility helper to create and store system/event notifications & emit real-time push
 * @param {Object} options
 * @param {string} options.recipient - Target User ObjectId
 * @param {string} [options.sender] - Triggering User ObjectId (optional)
 * @param {string} options.type - Notification type ('booking_update', 'new_review', 'new_message', 'system')
 * @param {string} options.title - Notification title
 * @param {string} options.message - Notification message content
 * @param {Object} [options.data] - Additional metadata payload (bookingId, propertyId, etc.)
 */
const sendNotification = async ({ recipient, sender = null, type, title, message, data = {} }) => {
  try {
    if (!recipient || !type || !title || !message) {
      console.warn('⚠️ Missing required fields for sendNotification call');
      return null;
    }

    const notification = await Notification.create({
      recipient,
      sender,
      type,
      title,
      message,
      data
    });

    // Populate sender info for real-time notification payload
    await notification.populate('sender', 'name avatar role');

    // Emit real-time notification event via Socket.io
    emitToUser(recipient, 'new_notification', notification);

    console.log(`🔔 Notification Created & Emitted [${type}] for User ${recipient}: "${title}"`);
    return notification;
  } catch (error) {
    console.error('❌ Failed to create notification:', error.message);
    return null;
  }
};

module.exports = { sendNotification };

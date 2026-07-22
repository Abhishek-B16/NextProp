const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getUserNotifications = async (req, res) => {
  try {
    const { unreadOnly, page = 1, limit = 20 } = req.query;

    const queryObj = { recipient: req.user._id };

    if (unreadOnly === 'true' || unreadOnly === true) {
      queryObj.read = false;
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalNotifications = await Notification.countDocuments(queryObj);
    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false
    });

    const notifications = await Notification.find(queryObj)
      .populate('sender', 'name avatar role')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean();

    return res.status(200).json({
      status: 'success',
      results: notifications.length,
      total: totalNotifications,
      unreadCount,
      page: pageNum,
      totalPages: Math.ceil(totalNotifications / limitNum) || 1,
      data: notifications
    });
  } catch (error) {
    console.error('❌ Get User Notifications Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching notifications'
    });
  }
};

// @desc    Get count of unread notifications
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Notification.countDocuments({
      recipient: req.user._id,
      read: false
    });

    return res.status(200).json({
      status: 'success',
      count: unreadCount
    });
  } catch (error) {
    console.error('❌ Get Unread Count Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching unread notification count'
    });
  }
};

// @desc    Mark a single notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: req.user._id },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        status: 'fail',
        message: 'Notification not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Notification marked as read',
      data: notification
    });
  } catch (error) {
    console.error('❌ Mark Notification As Read Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error updating notification status'
    });
  }
};

// @desc    Mark all notifications as read for current user
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, read: false },
      { read: true }
    );

    return res.status(200).json({
      status: 'success',
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('❌ Mark All As Read Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error updating notifications'
    });
  }
};

// @desc    Delete a notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;

    const notification = await Notification.findOneAndDelete({
      _id: id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        status: 'fail',
        message: 'Notification not found'
      });
    }

    return res.status(200).json({
      status: 'success',
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete Notification Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error deleting notification'
    });
  }
};

module.exports = {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
};

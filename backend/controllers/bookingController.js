const Booking = require('../models/Booking');
const Property = require('../models/Property');
const { sendNotification } = require('../utils/notificationHelper');

// @desc    Create a new property visit booking request
// @route   POST /api/bookings
// @access  Private (Customer / Authenticated User)
const createBooking = async (req, res) => {
  try {
    const { propertyId, visitDate, message } = req.body;

    if (!propertyId || !visitDate) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide both property ID and visit date'
      });
    }

    // 1. Validate Visit Date (Must be in the future)
    const bookingDate = new Date(visitDate);
    if (isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a valid date format for visit date'
      });
    }

    if (bookingDate.getTime() <= Date.now()) {
      return res.status(400).json({
        status: 'fail',
        message: 'Visit date must be in the future'
      });
    }

    // 2. Verify Property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found'
      });
    }

    // 3. Prevent owner from booking their own property
    if (property.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        status: 'fail',
        message: 'You cannot request a visit booking for a property that you own'
      });
    }

    // 4. Duplicate Booking Check: Check if active (pending/accepted) booking already exists for this customer & property
    const existingActiveBooking = await Booking.findOne({
      customer: req.user._id,
      property: propertyId,
      status: { $in: ['pending', 'accepted'] }
    });

    if (existingActiveBooking) {
      return res.status(400).json({
        status: 'fail',
        message: `You already have an active (${existingActiveBooking.status}) booking request for this property.`
      });
    }

    // 5. Create Booking Request
    const booking = await Booking.create({
      customer: req.user._id,
      owner: property.owner,
      property: propertyId,
      visitDate: bookingDate,
      message: message || '',
      status: 'pending'
    });

    // Populate references for response
    await booking.populate([
      { path: 'property' },
      { path: 'customer', select: 'name email phone avatar role' },
      { path: 'owner', select: 'name email phone avatar role' }
    ]);

    // Send Notification to Property Owner
    await sendNotification({
      recipient: property.owner,
      sender: req.user._id,
      type: 'booking_update',
      title: 'New Visit Booking Request',
      message: `${req.user.name} requested a visit for "${property.title}" on ${bookingDate.toDateString()}`,
      data: { bookingId: booking._id, propertyId: property._id }
    });

    console.log(`📅 Booking Request Created -> ID: ${booking._id} for Property ${propertyId}`);

    return res.status(201).json({
      status: 'success',
      message: 'Booking request submitted successfully',
      data: booking
    });
  } catch (error) {
    console.error('❌ Create Booking Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Server error creating booking request'
    });
  }
};

// @desc    Get user's booking requests (Customer or Owner view)
// @route   GET /api/bookings
// @access  Private (Authenticated User)
const getUserBookings = async (req, res) => {
  try {
    const { role, status } = req.query;

    const queryObj = {};

    // Filter by User Role (Customer vs Owner)
    if (role === 'customer') {
      queryObj.customer = req.user._id;
    } else if (role === 'owner') {
      queryObj.owner = req.user._id;
    } else {
      // Default: Return any bookings where user is involved
      queryObj.$or = [{ customer: req.user._id }, { owner: req.user._id }];
    }

    // Filter by Booking Status
    if (status) {
      queryObj.status = status;
    }

    const bookings = await Booking.find(queryObj)
      .populate('property')
      .populate('customer', 'name email phone avatar role')
      .populate('owner', 'name email phone avatar role')
      .sort('-createdAt')
      .lean();

    return res.status(200).json({
      status: 'success',
      results: bookings.length,
      data: bookings
    });
  } catch (error) {
    console.error('❌ Get User Bookings Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching booking records'
    });
  }
};

// @desc    Get single booking details by ID
// @route   GET /api/bookings/:id
// @access  Private (Customer / Owner involved or Admin)
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate('property')
      .populate('customer', 'name email phone avatar role')
      .populate('owner', 'name email phone avatar role');

    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: `Booking not found with ID: ${id}`
      });
    }

    // Authorization Check: User must be customer, owner, or admin
    const isCustomer = booking.customer._id.toString() === req.user._id.toString();
    const isOwner = booking.owner._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isOwner && !isAdmin) {
      return res.status(403).json({
        status: 'fail',
        message: 'Forbidden: You do not have permission to view this booking.'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: booking
    });
  } catch (error) {
    console.error('❌ Get Booking By ID Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching booking details'
    });
  }
};

// @desc    Update booking status (Accept / Reject / Complete / Cancel)
// @route   PUT /api/bookings/:id/status
// @access  Private (Owner / Customer involved)
const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['accepted', 'rejected', 'completed', 'cancelled'];
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        status: 'fail',
        message: `Invalid status. Allowed values: ${allowedStatuses.join(', ')}`
      });
    }

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({
        status: 'fail',
        message: `Booking not found with ID: ${id}`
      });
    }

    const isOwner = booking.owner.toString() === req.user._id.toString();
    const isCustomer = booking.customer.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    // Authorization Rules for Status Transitions:
    // 1. Accept / Reject: Only Property Owner or Admin can accept/reject pending requests
    if (['accepted', 'rejected'].includes(status)) {
      if (!isOwner && !isAdmin) {
        return res.status(403).json({
          status: 'fail',
          message: 'Forbidden: Only the property owner can accept or reject booking requests.'
        });
      }
    }

    // 2. Complete / Cancel: Owner or Customer can mark complete/cancel
    if (['completed', 'cancelled'].includes(status)) {
      if (!isOwner && !isCustomer && !isAdmin) {
        return res.status(403).json({
          status: 'fail',
          message: 'Forbidden: You do not have permission to modify this booking.'
        });
      }
    }

    // Apply Status Update
    booking.status = status;
    await booking.save();

    await booking.populate([
      { path: 'property' },
      { path: 'customer', select: 'name email phone avatar role' },
      { path: 'owner', select: 'name email phone avatar role' }
    ]);

    // Send Notification to recipient (other party in booking)
    const notificationRecipient = isOwner ? booking.customer._id : booking.owner._id;
    const propertyTitle = booking.property ? booking.property.title : 'Property';

    await sendNotification({
      recipient: notificationRecipient,
      sender: req.user._id,
      type: 'booking_update',
      title: `Booking Request ${status.toUpperCase()}`,
      message: `Your visit booking for "${propertyTitle}" has been marked as ${status}.`,
      data: { bookingId: booking._id, propertyId: booking.property ? booking.property._id : null, status }
    });

    console.log(`🔄 Booking ${id} status updated to '${status}' by User ${req.user._id}`);

    return res.status(200).json({
      status: 'success',
      message: `Booking request marked as '${status}' successfully`,
      data: booking
    });
  } catch (error) {
    console.error('❌ Update Booking Status Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Server error updating booking status'
    });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus
};

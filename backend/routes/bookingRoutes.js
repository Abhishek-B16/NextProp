const express = require('express');
const router = express.Router();
const {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus
} = require('../controllers/bookingController');
const { protectRoute } = require('../middleware/authMiddleware');

// All Booking endpoints require user authentication
router.use(protectRoute);

router.post('/', createBooking);
router.get('/', getUserBookings);
router.get('/:id', getBookingById);
router.put('/:id/status', updateBookingStatus);

module.exports = router;

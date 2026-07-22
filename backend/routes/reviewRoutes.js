const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createReview,
  getPropertyReviews,
  deleteReview
} = require('../controllers/reviewController');
const { protectRoute, customerOnly } = require('../middleware/authMiddleware');

// Public route to view property reviews
router.get('/', getPropertyReviews);

// Protected routes for review operations
router.post('/', protectRoute, customerOnly, createReview);
router.delete('/:id', protectRoute, deleteReview);

module.exports = router;

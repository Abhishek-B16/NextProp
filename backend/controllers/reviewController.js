const Review = require('../models/Review');
const Property = require('../models/Property');
const Booking = require('../models/Booking');

// @desc    Create a new review for a property
// @route   POST /api/properties/:propertyId/reviews or POST /api/reviews
// @access  Private (Customer only - must have a verified booking)
const createReview = async (req, res) => {
  try {
    const propertyId = req.params.propertyId || req.body.propertyId;
    const { rating, comment } = req.body;

    if (!propertyId || !rating || !comment) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide property ID, rating (1-5), and comment'
      });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        status: 'fail',
        message: 'Rating must be a number between 1 and 5'
      });
    }

    // 1. Verify Property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found'
      });
    }

    // 2. Booking Verification Rule: Ensure customer has a verified booking for this property
    const verifiedBooking = await Booking.findOne({
      customer: req.user._id,
      property: propertyId,
      status: { $in: ['accepted', 'completed'] }
    });

    if (!verifiedBooking) {
      return res.status(403).json({
        status: 'fail',
        message: 'Forbidden: Only customers who have a verified booking (accepted or completed) for this property can leave a review.'
      });
    }

    // 3. Duplicate Review Check: Ensure customer hasn't already reviewed this property
    const existingReview = await Review.findOne({
      user: req.user._id,
      property: propertyId
    });

    if (existingReview) {
      return res.status(400).json({
        status: 'fail',
        message: 'You have already submitted a review for this property'
      });
    }

    // 4. Create Review
    const review = await Review.create({
      user: req.user._id,
      property: propertyId,
      rating: numericRating,
      comment: comment.trim()
    });

    await review.populate('user', 'name avatar role');

    console.log(`💬 Review submitted for Property ${propertyId} by Customer ${req.user._id} (Rating: ${numericRating})`);

    return res.status(201).json({
      status: 'success',
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    console.error('❌ Create Review Error:', error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        message: 'You have already submitted a review for this property'
      });
    }

    return res.status(500).json({
      status: 'error',
      message: error.message || 'Server error submitting review'
    });
  }
};

// @desc    Get all reviews for a property
// @route   GET /api/properties/:propertyId/reviews
// @access  Public
const getPropertyReviews = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found'
      });
    }

    const reviews = await Review.find({ property: propertyId })
      .populate('user', 'name avatar role')
      .sort('-createdAt')
      .lean();

    return res.status(200).json({
      status: 'success',
      results: reviews.length,
      averageRating: property.averageRating,
      numOfReviews: property.numOfReviews,
      data: reviews
    });
  } catch (error) {
    console.error('❌ Get Property Reviews Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching property reviews'
    });
  }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private (Review owner / Admin)
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({
        status: 'fail',
        message: `Review not found with ID: ${id}`
      });
    }

    // Authorization Rule: Only the user who created the review or an admin can delete it
    const isOwner = review.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        status: 'fail',
        message: 'Forbidden: You are not authorized to delete this review.'
      });
    }

    await review.deleteOne();

    console.log(`🗑️ Review ${id} deleted by User ${req.user._id}`);

    return res.status(200).json({
      status: 'success',
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete Review Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error deleting review'
    });
  }
};

module.exports = {
  createReview,
  getPropertyReviews,
  deleteReview
};

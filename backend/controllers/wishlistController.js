const Wishlist = require('../models/Wishlist');
const Property = require('../models/Property');

// @desc    Add property to user wishlist
// @route   POST /api/wishlist/:propertyId or POST /api/wishlist
// @access  Private (Authenticated User / Customer)
const addToWishlist = async (req, res) => {
  try {
    const propertyId = req.params.propertyId || req.body.propertyId;

    if (!propertyId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a valid property ID'
      });
    }

    // 1. Verify property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found'
      });
    }

    // 2. Check if already in wishlist (Pre-validation check)
    const existingEntry = await Wishlist.findOne({
      user: req.user._id,
      property: propertyId
    });

    if (existingEntry) {
      return res.status(400).json({
        status: 'fail',
        message: 'Property is already saved in your wishlist'
      });
    }

    // 3. Create wishlist entry
    const wishlistItem = await Wishlist.create({
      user: req.user._id,
      property: propertyId
    });

    // Populate property details for response
    await wishlistItem.populate({
      path: 'property',
      populate: { path: 'owner', select: 'name email phone avatar role' }
    });

    console.log(`❤️ Property ${propertyId} saved to Wishlist by User ${req.user._id}`);

    return res.status(201).json({
      status: 'success',
      message: 'Property saved to wishlist successfully',
      data: wishlistItem
    });
  } catch (error) {
    console.error('❌ Add to Wishlist Error:', error.message);

    // Duplicate Key Error handling (Mongo Code 11000)
    if (error.code === 11000) {
      return res.status(400).json({
        status: 'fail',
        message: 'Property is already in your wishlist'
      });
    }

    return res.status(500).json({
      status: 'error',
      message: 'Server error adding property to wishlist'
    });
  }
};

// @desc    Remove property from user wishlist
// @route   DELETE /api/wishlist/:propertyId
// @access  Private (Authenticated User)
const removeFromWishlist = async (req, res) => {
  try {
    const { propertyId } = req.params;

    if (!propertyId) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide a property ID to remove'
      });
    }

    const deletedItem = await Wishlist.findOneAndDelete({
      user: req.user._id,
      property: propertyId
    });

    if (!deletedItem) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found in your wishlist'
      });
    }

    console.log(`💔 Property ${propertyId} removed from Wishlist by User ${req.user._id}`);

    return res.status(200).json({
      status: 'success',
      message: 'Property removed from wishlist successfully'
    });
  } catch (error) {
    console.error('❌ Remove from Wishlist Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error removing property from wishlist'
    });
  }
};

// @desc    Get current user's saved wishlist properties
// @route   GET /api/wishlist
// @access  Private (Authenticated User)
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ user: req.user._id })
      .populate({
        path: 'property',
        populate: { path: 'owner', select: 'name email phone avatar role' }
      })
      .sort('-createdAt')
      .lean();

    // Filter out any null entries if a property was deleted from system
    const validWishlistItems = wishlist.filter((item) => item.property !== null);

    return res.status(200).json({
      status: 'success',
      results: validWishlistItems.length,
      data: validWishlistItems
    });
  } catch (error) {
    console.error('❌ Get Wishlist Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching user wishlist'
    });
  }
};

// @desc    Check if a specific property is in user's wishlist
// @route   GET /api/wishlist/check/:propertyId
// @access  Private (Authenticated User)
const checkWishlistStatus = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const existingEntry = await Wishlist.findOne({
      user: req.user._id,
      property: propertyId
    });

    return res.status(200).json({
      status: 'success',
      isSaved: Boolean(existingEntry)
    });
  } catch (error) {
    console.error('❌ Check Wishlist Status Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error checking wishlist status'
    });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlistStatus
};

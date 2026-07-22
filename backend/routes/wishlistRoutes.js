const express = require('express');
const router = express.Router();
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  checkWishlistStatus
} = require('../controllers/wishlistController');
const { protectRoute } = require('../middleware/authMiddleware');

// All Wishlist routes require authentication
router.use(protectRoute);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.post('/:propertyId', addToWishlist);
router.delete('/:propertyId', removeFromWishlist);
router.get('/check/:propertyId', checkWishlistStatus);

module.exports = router;

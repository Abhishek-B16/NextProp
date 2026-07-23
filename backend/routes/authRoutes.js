const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateUserProfile,
  getOwnerPublicProfile
} = require('../controllers/authController');
const { protectRoute } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/owner/:id', getOwnerPublicProfile);

// Protected routes
router.post('/logout', protectRoute, logoutUser);
router.get('/me', protectRoute, getMe);
router.put('/profile', protectRoute, updateUserProfile);

module.exports = router;

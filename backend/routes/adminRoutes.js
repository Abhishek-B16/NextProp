const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getAllUsers,
  verifyOwner,
  deleteUser,
  getAllPropertiesAdmin,
  deletePropertyAdmin
} = require('../controllers/adminController');
const { protectRoute, adminOnly } = require('../middleware/authMiddleware');

// All Admin routes require authentication AND admin role
router.use(protectRoute, adminOnly);

// Analytics Dashboard Endpoint
router.get('/analytics', getDashboardAnalytics);

// User Management Endpoints
router.get('/users', getAllUsers);
router.put('/users/:id/verify', verifyOwner);
router.delete('/users/:id', deleteUser);

// Property Management Endpoints
router.get('/properties', getAllPropertiesAdmin);
router.delete('/properties/:id', deletePropertyAdmin);

module.exports = router;

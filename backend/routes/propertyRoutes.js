const express = require('express');
const router = express.Router();
const {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');
const { protectRoute, ownerOnly } = require('../middleware/authMiddleware');

// Public routes for viewing properties
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Protected routes for creating, updating & deleting properties
router.post('/', protectRoute, ownerOnly, createProperty);
router.put('/:id', protectRoute, updateProperty);
router.delete('/:id', protectRoute, deleteProperty);

module.exports = router;

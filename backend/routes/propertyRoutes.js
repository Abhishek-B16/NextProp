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
const { uploadPropertyImages } = require('../middleware/uploadMiddleware');

// Public routes for viewing properties
router.get('/', getAllProperties);
router.get('/:id', getPropertyById);

// Protected routes for creating, updating & deleting properties with ImageKit upload support
router.post('/', protectRoute, ownerOnly, uploadPropertyImages, createProperty);
router.put('/:id', protectRoute, uploadPropertyImages, updateProperty);
router.delete('/:id', protectRoute, deleteProperty);

module.exports = router;

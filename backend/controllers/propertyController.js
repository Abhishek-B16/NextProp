const Property = require('../models/Property');

// @desc    Create a new property listing
// @route   POST /api/properties
// @access  Private (Owner / Admin)
const createProperty = async (req, res) => {
  try {
    console.log(`📝 Creating Property Listing by User ID: ${req.user._id} (${req.user.role})`);
    
    const {
      title,
      description,
      purpose,
      propertyType,
      price,
      address,
      city,
      state,
      country,
      pincode,
      bedrooms,
      bathrooms,
      area,
      amenities,
      images,
      status
    } = req.body;

    // Create property attached to authenticated user (owner)
    const property = await Property.create({
      title,
      description,
      purpose,
      propertyType,
      price,
      address,
      city,
      state,
      country,
      pincode,
      bedrooms: bedrooms || 0,
      bathrooms: bathrooms || 0,
      area,
      amenities: amenities || [],
      images: images || [],
      status: status || 'available',
      owner: req.user._id
    });

    console.log(`🎉 SUCCESS: Property Created -> ID: ${property._id} | Title: "${property.title}"`);

    return res.status(201).json({
      status: 'success',
      message: 'Property created successfully',
      data: property
    });
  } catch (error) {
    console.error('❌ Create Property Error:', error.message);
    return res.status(400).json({
      status: 'fail',
      message: error.message || 'Failed to create property listing'
    });
  }
};

// @desc    Get all property listings with search, filter & pagination
// @route   GET /api/properties
// @access  Public
const getAllProperties = async (req, res) => {
  try {
    const {
      city,
      purpose,
      propertyType,
      status,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    const queryObj = {};

    // Filter by City
    if (city) {
      queryObj.city = { $regex: city, $options: 'i' };
    }

    // Filter by Purpose (Rent/Sell)
    if (purpose) {
      queryObj.purpose = purpose;
    }

    // Filter by Property Type
    if (propertyType) {
      queryObj.propertyType = propertyType;
    }

    // Filter by Status (default filter if not requested otherwise)
    if (status) {
      queryObj.status = status;
    }

    // Filter by Price Range
    if (minPrice || maxPrice) {
      queryObj.price = {};
      if (minPrice) queryObj.price.$gte = Number(minPrice);
      if (maxPrice) queryObj.price.$lte = Number(maxPrice);
    }

    // General Keyword Search
    if (search) {
      queryObj.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalProperties = await Property.countDocuments(queryObj);
    const properties = await Property.find(queryObj)
      .populate('owner', 'name email phone avatar role')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    return res.status(200).json({
      status: 'success',
      results: properties.length,
      total: totalProperties,
      page: pageNum,
      totalPages: Math.ceil(totalProperties / limitNum),
      data: properties
    });
  } catch (error) {
    console.error('❌ Get All Properties Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching property listings'
    });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id).populate(
      'owner',
      'name email phone avatar role'
    );

    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: `Property not found with ID: ${id}`
      });
    }

    return res.status(200).json({
      status: 'success',
      data: property
    });
  } catch (error) {
    console.error('❌ Get Property By ID Error:', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        status: 'fail',
        message: 'Invalid Property ID format'
      });
    }
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching property details'
    });
  }
};

// @desc    Update property listing
// @route   PUT /api/properties/:id
// @access  Private (Owner of property / Admin)
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    let property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: `Property not found with ID: ${id}`
      });
    }

    // Authorization Rule: Only property owner or admin can edit
    const isOwner = property.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      console.log(`⚠️ Unauthorized Update Attempt on Property ${id} by User ${req.user._id}`);
      return res.status(403).json({
        status: 'fail',
        message: 'Forbidden: You can only edit properties that you own.'
      });
    }

    // Update fields
    property = await Property.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    }).populate('owner', 'name email phone avatar role');

    console.log(`✅ SUCCESS: Property ${id} updated by User ${req.user._id}`);

    return res.status(200).json({
      status: 'success',
      message: 'Property updated successfully',
      data: property
    });
  } catch (error) {
    console.error('❌ Update Property Error:', error.message);
    return res.status(400).json({
      status: 'fail',
      message: error.message || 'Failed to update property'
    });
  }
};

// @desc    Delete property listing
// @route   DELETE /api/properties/:id
// @access  Private (Owner of property / Admin)
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: `Property not found with ID: ${id}`
      });
    }

    // Authorization Rule: Only property owner or admin can delete
    const isOwner = property.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      console.log(`⚠️ Unauthorized Delete Attempt on Property ${id} by User ${req.user._id}`);
      return res.status(403).json({
        status: 'fail',
        message: 'Forbidden: You can only delete properties that you own.'
      });
    }

    await property.deleteOne();

    console.log(`🗑️ SUCCESS: Property ${id} deleted by User ${req.user._id}`);

    return res.status(200).json({
      status: 'success',
      message: 'Property listing deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete Property Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error deleting property'
    });
  }
};

module.exports = {
  createProperty,
  getAllProperties,
  getPropertyById,
  updateProperty,
  deleteProperty
};

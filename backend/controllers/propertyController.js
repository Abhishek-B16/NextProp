const Property = require('../models/Property');
const {
  uploadImageToImageKit,
  deleteImageFromImageKit,
  deleteMultipleImagesFromImageKit
} = require('../utils/imagekit');

// @desc    Create a new property listing with optional ImageKit file uploads
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
      status
    } = req.body;

    let propertyImages = [];

    // 1. Process files uploaded via Multer to ImageKit
    if (req.files && req.files.length > 0) {
      console.log(`📸 Uploading ${req.files.length} images to ImageKit...`);
      const uploadPromises = req.files.map((file) =>
        uploadImageToImageKit(file.buffer, file.originalname, 'nestora/properties')
      );
      propertyImages = await Promise.all(uploadPromises);
      console.log(`✅ Uploaded ${propertyImages.length} images to ImageKit successfully.`);
    } 
    // 2. Fallback if images array passed as JSON body
    else if (req.body.images) {
      try {
        const rawImages = typeof req.body.images === 'string' 
          ? JSON.parse(req.body.images) 
          : req.body.images;

        if (Array.isArray(rawImages)) {
          propertyImages = rawImages.map((img) =>
            typeof img === 'string' ? { url: img, fileId: 'manual_entry' } : img
          );
        }
      } catch (err) {
        console.warn('⚠️ JSON parsing fallback for images array failed:', err.message);
      }
    }

    // Parse amenities if passed as stringified JSON or comma-separated list
    let parsedAmenities = [];
    if (amenities) {
      if (Array.isArray(amenities)) {
        parsedAmenities = amenities;
      } else if (typeof amenities === 'string') {
        try {
          parsedAmenities = JSON.parse(amenities);
        } catch (e) {
          parsedAmenities = amenities.split(',').map((item) => item.trim());
        }
      }
    }

    // Create property in MongoDB
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
      amenities: parsedAmenities,
      images: propertyImages,
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

// @desc    Get property listings with advanced search, multi-field filtering, sorting & pagination
// @route   GET /api/properties
// @access  Public
const getAllProperties = async (req, res) => {
  try {
    const {
      keyword,
      search,
      city,
      state,
      purpose,
      propertyType,
      bedrooms,
      bathrooms,
      status,
      minPrice,
      maxPrice,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    const queryObj = {};

    // 1. Keyword / Full Text Search across title, description, city, state, address
    const searchKeyword = keyword || search;
    if (searchKeyword && searchKeyword.trim() !== '') {
      const regex = new RegExp(searchKeyword.trim(), 'i');
      queryObj.$or = [
        { title: regex },
        { description: regex },
        { city: regex },
        { state: regex },
        { address: regex }
      ];
    }

    // 2. City Filter (Case-insensitive)
    if (city && city.trim() !== '') {
      queryObj.city = { $regex: city.trim(), $options: 'i' };
    }

    // 3. State Filter (Case-insensitive)
    if (state && state.trim() !== '') {
      queryObj.state = { $regex: state.trim(), $options: 'i' };
    }

    // 4. Purpose Filter (Rent / Sell)
    if (purpose && purpose.trim() !== '') {
      queryObj.purpose = purpose.trim();
    }

    // 5. Property Type Filter
    if (propertyType && propertyType.trim() !== '') {
      queryObj.propertyType = propertyType.trim();
    }

    // 6. Status Filter (default to 'available' unless specifically asked for 'all' or specific status)
    if (status && status.toLowerCase() !== 'all') {
      queryObj.status = status;
    } else if (!status) {
      queryObj.status = 'available';
    }

    // 7. Bedrooms Filter (Minimum bedrooms)
    if (bedrooms !== undefined && bedrooms !== '') {
      queryObj.bedrooms = { $gte: Number(bedrooms) };
    }

    // 8. Bathrooms Filter (Minimum bathrooms)
    if (bathrooms !== undefined && bathrooms !== '') {
      queryObj.bathrooms = { $gte: Number(bathrooms) };
    }

    // 9. Price Range Filter
    if (minPrice !== undefined && minPrice !== '' || maxPrice !== undefined && maxPrice !== '') {
      queryObj.price = {};
      if (minPrice !== undefined && minPrice !== '') queryObj.price.$gte = Number(minPrice);
      if (maxPrice !== undefined && maxPrice !== '') queryObj.price.$lte = Number(maxPrice);
    }

    // 10. Sorting Logic: Latest, Price Low -> High, Price High -> Low
    let sortOptions = { createdAt: -1 }; // Default: Latest
    if (sort) {
      const lowerSort = sort.toLowerCase();
      if (lowerSort === 'price-asc' || lowerSort === 'price' || lowerSort === 'low-to-high') {
        sortOptions = { price: 1 };
      } else if (lowerSort === 'price-desc' || lowerSort === '-price' || lowerSort === 'high-to-low') {
        sortOptions = { price: -1 };
      } else if (lowerSort === 'oldest' || lowerSort === 'createdat') {
        sortOptions = { createdAt: 1 };
      } else if (lowerSort === 'latest' || lowerSort === '-createdat') {
        sortOptions = { createdAt: -1 };
      }
    }

    // 11. Pagination Controls
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // 12. Execute DB Count & Query concurrently with lean optimization
    const [totalProperties, properties] = await Promise.all([
      Property.countDocuments(queryObj),
      Property.find(queryObj)
        .populate('owner', 'name email phone avatar role')
        .sort(sortOptions)
        .skip(skip)
        .limit(limitNum)
        .lean()
    ]);

    const totalPages = Math.ceil(totalProperties / limitNum) || 1;

    return res.status(200).json({
      status: 'success',
      results: properties.length,
      total: totalProperties,
      page: pageNum,
      limit: limitNum,
      totalPages: totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1,
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

// @desc    Update property listing (support image upload, replacement, and deletion)
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

    let updatedImages = [...property.images];
    const shouldReplaceImages =
      req.body.replaceImages === 'true' || req.body.replaceImages === true;

    // Handle new file uploads
    if (req.files && req.files.length > 0) {
      console.log(`📸 Uploading ${req.files.length} new images for update to ImageKit...`);
      const uploadPromises = req.files.map((file) =>
        uploadImageToImageKit(file.buffer, file.originalname, 'nestora/properties')
      );
      const newImages = await Promise.all(uploadPromises);

      if (shouldReplaceImages) {
        // Delete all old images from ImageKit
        const oldFileIds = property.images.map((img) => img.fileId).filter(Boolean);
        if (oldFileIds.length > 0) {
          console.log(`🗑️ Replacing existing images... Deleting ${oldFileIds.length} old images from ImageKit`);
          await deleteMultipleImagesFromImageKit(oldFileIds);
        }
        updatedImages = newImages;
      } else {
        // Append new images to existing list
        updatedImages = [...updatedImages, ...newImages];
      }
    }

    // Handle specific fileId deletions if provided in req.body.deleteFileIds
    if (req.body.deleteFileIds) {
      let fileIdsToDelete = [];
      if (Array.isArray(req.body.deleteFileIds)) {
        fileIdsToDelete = req.body.deleteFileIds;
      } else if (typeof req.body.deleteFileIds === 'string') {
        try {
          fileIdsToDelete = JSON.parse(req.body.deleteFileIds);
        } catch (e) {
          fileIdsToDelete = req.body.deleteFileIds.split(',').map((s) => s.trim());
        }
      }

      if (fileIdsToDelete.length > 0) {
        await deleteMultipleImagesFromImageKit(fileIdsToDelete);
        updatedImages = updatedImages.filter((img) => !fileIdsToDelete.includes(img.fileId));
      }
    }

    // Prepare update data
    const updateData = { ...req.body };
    delete updateData.replaceImages;
    delete updateData.deleteFileIds;

    // Handle parsing amenities if updated
    if (updateData.amenities) {
      if (typeof updateData.amenities === 'string') {
        try {
          updateData.amenities = JSON.parse(updateData.amenities);
        } catch (e) {
          updateData.amenities = updateData.amenities.split(',').map((item) => item.trim());
        }
      }
    }

    updateData.images = updatedImages;

    // Update property in DB
    property = await Property.findByIdAndUpdate(id, updateData, {
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

// @desc    Delete property listing and purge associated images from ImageKit
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

    // Extract fileIds and delete from ImageKit
    const fileIdsToDelete = property.images.map((img) => img.fileId).filter(Boolean);

    if (fileIdsToDelete.length > 0) {
      console.log(`🗑️ Deleting ${fileIdsToDelete.length} associated images from ImageKit...`);
      await deleteMultipleImagesFromImageKit(fileIdsToDelete);
    }

    // Delete property document from MongoDB
    await property.deleteOne();

    console.log(`🗑️ SUCCESS: Property ${id} deleted by User ${req.user._id}`);

    return res.status(200).json({
      status: 'success',
      message: 'Property listing and associated images deleted successfully'
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

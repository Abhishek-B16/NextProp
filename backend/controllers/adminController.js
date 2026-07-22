const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const { deleteMultipleImagesFromImageKit } = require('../utils/imagekit');
const { sendNotification } = require('../utils/notificationHelper');

// @desc    Get complete admin dashboard analytics & chart data
// @route   GET /api/admin/analytics
// @access  Private (Admin only)
const getDashboardAnalytics = async (req, res) => {
  try {
    console.log(`📊 Generating Admin Dashboard Analytics for Admin ID: ${req.user._id}`);

    // 1. Concurrent Summary Metrics & Totals
    const [
      totalUsers,
      totalProperties,
      totalBookings,
      customersCount,
      ownersCount,
      verifiedOwnersCount,
      adminsCount
    ] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Booking.countDocuments(),
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'owner' }),
      User.countDocuments({ role: 'owner', isVerifiedOwner: true }),
      User.countDocuments({ role: 'admin' })
    ]);

    // 2. Property Status Breakdown
    const propertyStatusStats = await Property.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // 3. Booking Status Breakdown
    const bookingStatusStats = await Booking.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // 4. Revenue Aggregation (Sum of price of Sold / Rented properties)
    const revenueStats = await Property.aggregate([
      {
        $match: { status: { $in: ['rented', 'sold'] } }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$price' }
        }
      }
    ]);

    const totalRevenue = revenueStats.length > 0 ? revenueStats[0].totalRevenue : 0;

    // 5. Chart Data: Monthly Bookings Trend (Past 6 Months)
    const monthlyBookingsChart = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 }
    ]);

    // 6. Chart Data: Property Type Distribution
    const propertyTypeDistribution = await Property.aggregate([
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 }
        }
      }
    ]);

    // 7. Chart Data: Purpose Distribution (Rent vs Sell)
    const purposeDistribution = await Property.aggregate([
      {
        $group: {
          _id: '$purpose',
          count: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json({
      status: 'success',
      data: {
        summary: {
          totalUsers,
          totalProperties,
          totalBookings,
          totalRevenue,
          roles: {
            customersCount,
            ownersCount,
            verifiedOwnersCount,
            adminsCount
          }
        },
        breakdowns: {
          propertyStatus: propertyStatusStats,
          bookingStatus: bookingStatusStats
        },
        charts: {
          monthlyBookingsChart,
          propertyTypeDistribution,
          purposeDistribution
        }
      }
    });
  } catch (error) {
    console.error('❌ Get Dashboard Analytics Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error generating dashboard analytics'
    });
  }
};

// @desc    Get all users with search, role filter & pagination
// @route   GET /api/admin/users
// @access  Private (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const { role, isVerified, search, page = 1, limit = 10, sort = '-createdAt' } = req.query;

    const queryObj = {};

    if (role) {
      queryObj.role = role;
    }

    if (isVerified !== undefined) {
      queryObj.isVerifiedOwner = isVerified === 'true' || isVerified === true;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      queryObj.$or = [{ name: regex }, { email: regex }, { phone: regex }];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalUsers = await User.countDocuments(queryObj);
    const users = await User.find(queryObj)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();

    return res.status(200).json({
      status: 'success',
      results: users.length,
      total: totalUsers,
      page: pageNum,
      totalPages: Math.ceil(totalUsers / limitNum) || 1,
      data: users
    });
  } catch (error) {
    console.error('❌ Get All Users Admin Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching user list'
    });
  }
};

// @desc    Verify or toggle Property Owner verification status
// @route   PUT /api/admin/users/:id/verify
// @access  Private (Admin only)
const verifyOwner = async (req, res) => {
  try {
    const { id } = req.params;
    const { isVerified = true } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    if (user.role !== 'owner') {
      return res.status(400).json({
        status: 'fail',
        message: `User role is '${user.role}'. Only property owners can be verified.`
      });
    }

    user.isVerifiedOwner = Boolean(isVerified);
    await user.save();

    // Send Notification to Owner
    await sendNotification({
      recipient: user._id,
      sender: req.user._id,
      type: 'system',
      title: user.isVerifiedOwner ? 'Owner Account Verified 🎉' : 'Owner Verification Updated',
      message: user.isVerifiedOwner
        ? 'Congratulations! Your property owner account has been verified by the admin.'
        : 'Your owner verification status has been updated by the admin.',
      data: { isVerified: user.isVerifiedOwner }
    });

    console.log(`✅ Owner Verification Updated -> ID: ${user._id} | Verified: ${user.isVerifiedOwner}`);

    return res.status(200).json({
      status: 'success',
      message: `Owner verification set to ${user.isVerifiedOwner}`,
      data: user
    });
  } catch (error) {
    console.error('❌ Verify Owner Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error updating owner verification'
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        status: 'fail',
        message: 'You cannot delete your own admin account'
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User not found'
      });
    }

    await user.deleteOne();

    console.log(`🗑️ User Account ${id} deleted by Admin ${req.user._id}`);

    return res.status(200).json({
      status: 'success',
      message: 'User account deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete User Admin Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error deleting user account'
    });
  }
};

// @desc    Get all properties (Admin view)
// @route   GET /api/admin/properties
// @access  Private (Admin only)
const getAllPropertiesAdmin = async (req, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    const queryObj = {};

    if (status) {
      queryObj.status = status;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      queryObj.$or = [{ title: regex }, { city: regex }, { address: regex }];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const totalProperties = await Property.countDocuments(queryObj);
    const properties = await Property.find(queryObj)
      .populate('owner', 'name email phone avatar role isVerifiedOwner')
      .sort('-createdAt')
      .skip(skip)
      .limit(limitNum)
      .lean();

    return res.status(200).json({
      status: 'success',
      results: properties.length,
      total: totalProperties,
      page: pageNum,
      totalPages: Math.ceil(totalProperties / limitNum) || 1,
      data: properties
    });
  } catch (error) {
    console.error('❌ Get All Properties Admin Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching properties for admin'
    });
  }
};

// @desc    Delete any property listing by ID (Admin control)
// @route   DELETE /api/admin/properties/:id
// @access  Private (Admin only)
const deletePropertyAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await Property.findById(id);

    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found'
      });
    }

    // Purge images from ImageKit
    const fileIdsToDelete = property.images.map((img) => img.fileId).filter(Boolean);
    if (fileIdsToDelete.length > 0) {
      await deleteMultipleImagesFromImageKit(fileIdsToDelete);
    }

    await property.deleteOne();

    console.log(`🗑️ Property ${id} deleted by Admin ${req.user._id}`);

    return res.status(200).json({
      status: 'success',
      message: 'Property listing and associated media deleted successfully'
    });
  } catch (error) {
    console.error('❌ Delete Property Admin Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error deleting property'
    });
  }
};

module.exports = {
  getDashboardAnalytics,
  getAllUsers,
  verifyOwner,
  deleteUser,
  getAllPropertiesAdmin,
  deletePropertyAdmin
};

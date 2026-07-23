const User = require('../models/User');
const { sendTokenResponse } = require('../utils/generateToken');

// @desc    Register a new user (customer or property owner)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    console.log('📝 Incoming Registration Request Payload:', req.body);
    const { name, email, password, role, phone, avatar } = req.body;

    if (!name || !email || !password) {
      console.log('⚠️  Registration Failed: Missing required fields (name, email, or password)');
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide name, email, and password.'
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      console.log(`⚠️  Registration Failed: Email '${email}' already exists in database.`);
      return res.status(400).json({
        status: 'fail',
        message: 'An account with this email address already exists.'
      });
    }

    // Role safety check: self-registration can only be 'customer' or 'owner'
    const assignedRole = role === 'owner' ? 'owner' : 'customer';

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
      phone: phone || '',
      avatar: avatar || ''
    });

    console.log(`🎉 SUCCESS: User Registered -> ID: ${user._id} | Name: "${user.name}" | Email: "${user.email}" | Role: "${user.role}"`);

    sendTokenResponse(user, 201, res, 'User registered successfully.');
  } catch (error) {
    console.error('❌ Registration Server Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Server error during user registration.'
    });
  }
};

// @desc    Authenticate user & get token via HTTP-Only cookie
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    console.log('🔑 Incoming Login Request:', req.body ? req.body.email : 'No Body');
    const { email, password } = req.body;

    if (!email || !password) {
      console.log('⚠️  Login Failed: Missing email or password');
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide both email and password.'
      });
    }

    // Find user and explicitly select password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      console.log(`⚠️  Login Failed: Invalid credentials for '${email}'`);
      return res.status(401).json({
        status: 'fail',
        message: 'Invalid email or password.'
      });
    }

    console.log(`🎉 SUCCESS: User Logged In -> ID: ${user._id} | Email: "${user.email}" | Role: "${user.role}"`);

    sendTokenResponse(user, 200, res, 'Login successful.');
  } catch (error) {
    console.error('❌ Login Server Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Server error during login.'
    });
  }
};

// @desc    Log user out & clear HTTP-Only cookie
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = (req, res) => {
  console.log(`🚪 User Logged Out -> ID: ${req.user._id}`);
  res.cookie('jwt', 'none', {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production'
  });

  return res.status(200).json({
    status: 'success',
    message: 'Logged out successfully.'
  });
};

// @desc    Get current authenticated user (Me)
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    console.log(`👤 Fetching Me Profile -> ID: ${req.user._id}`);
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User profile not found.'
      });
    }

    return res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    console.error('❌ Get Me Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Server error fetching user details.'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    console.log(`✏️ Updating Profile -> ID: ${req.user._id}`);
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'User profile not found.'
      });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;

    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({
          status: 'fail',
          message: 'Password must be at least 6 characters long.'
        });
      }
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    console.log(`✅ Profile Updated -> ID: ${updatedUser._id}`);
    sendTokenResponse(updatedUser, 200, res, 'Profile updated successfully.');
  } catch (error) {
    console.error('❌ Update Profile Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Server error updating user profile.'
    });
  }
};

// @desc    Get owner public profile with their properties
// @route   GET /api/auth/owner/:id
// @access  Public
const getOwnerPublicProfile = async (req, res) => {
  try {
    const owner = await User.findById(req.params.id).select('-password');
    if (!owner) {
      return res.status(404).json({
        status: 'fail',
        message: 'Owner profile not found.'
      });
    }

    const Property = require('../models/Property');
    const properties = await Property.find({ owner: owner._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      data: {
        owner,
        totalListings: properties.length,
        responseTime: 'Within 1 hour',
        rating: 4.9,
        properties
      }
    });
  } catch (error) {
    console.error('❌ Get Owner Profile Error:', error.message);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Server error fetching owner profile.'
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getMe,
  updateUserProfile,
  getOwnerPublicProfile
};

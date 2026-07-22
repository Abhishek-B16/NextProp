const jwt = require('jsonwebtoken');

// Generate JWT signed token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || process.env.JWT_EXPIRE || '30d'
  });
};

// Generate token, attach HTTP-Only cookie to response, and return JSON payload
const sendTokenResponse = (user, statusCode, res, message = '') => {
  const token = generateToken(user._id, user.role);

  // Cookie options
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    httpOnly: true, // Prevent XSS access
    secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
    sameSite: 'strict' // CSRF protection
  };

  // Convert user to plain object and ensure password is removed
  const userPayload = user.toObject ? user.toObject() : { ...user };
  delete userPayload.password;

  res.status(statusCode).cookie('jwt', token, options).json({
    status: 'success',
    message: message || 'Authentication successful',
    token,
    data: userPayload
  });
};

module.exports = { generateToken, sendTokenResponse };

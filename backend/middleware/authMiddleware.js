const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - Verify token from HTTP-Only cookie or Bearer header
const protectRoute = async (req, res, next) => {
  let token;

  // 1. Read token from HTTP-Only cookie first
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  } 
  // 2. Fallback to Bearer token header if present
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      status: 'fail',
      message: 'Access denied. Please log in to access this resource.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user without password (select: false handles password omission)
    const currentUser = await User.findById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        status: 'fail',
        message: 'The user belonging to this token no longer exists.'
      });
    }

    req.user = currentUser;
    next();
  } catch (error) {
    console.error('Auth verification error:', error.message);
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid or expired token. Please log in again.'
    });
  }
};

// Generic Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'fail',
        message: 'User authentication required.'
      });
    }

    // Admin always has full access, otherwise check specified allowed roles
    if (req.user.role === 'admin' || roles.includes(req.user.role)) {
      return next();
    }

    return res.status(403).json({
      status: 'fail',
      message: `Forbidden: User role '${req.user.role}' does not have permission to perform this action.`
    });
  };
};

// Specialized role middleware helpers
const ownerOnly = authorize('owner');
const customerOnly = authorize('customer');
const adminOnly = authorize('admin');

module.exports = {
  protectRoute,
  authorize,
  ownerOnly,
  customerOnly,
  adminOnly
};

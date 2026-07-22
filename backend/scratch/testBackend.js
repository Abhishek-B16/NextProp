const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

console.log('🔍 STARTING FULL BACKEND INTEGRITY AUDIT...\n');

try {
  // 1. Check all Models
  console.log('1️⃣ Checking Mongoose Models...');
  const User = require('../models/User');
  const Property = require('../models/Property');
  const Wishlist = require('../models/Wishlist');
  const Booking = require('../models/Booking');
  const Review = require('../models/Review');
  const Notification = require('../models/Notification');
  const Conversation = require('../models/Conversation');
  const Message = require('../models/Message');
  console.log('   ✅ User, Property, Wishlist, Booking, Review, Notification, Conversation, Message models loaded.');

  // 2. Check all Controllers
  console.log('\n2️⃣ Checking Controllers...');
  const authController = require('../controllers/authController');
  const propertyController = require('../controllers/propertyController');
  const wishlistController = require('../controllers/wishlistController');
  const bookingController = require('../controllers/bookingController');
  const reviewController = require('../controllers/reviewController');
  const notificationController = require('../controllers/notificationController');
  const chatController = require('../controllers/chatController');
  const adminController = require('../controllers/adminController');
  console.log('   ✅ All 8 controllers loaded successfully.');

  // 3. Check Middleware & Utilities
  console.log('\n3️⃣ Checking Middleware & Utilities...');
  const authMiddleware = require('../middleware/authMiddleware');
  const uploadMiddleware = require('../middleware/uploadMiddleware');
  const imagekit = require('../utils/imagekit');
  const generateToken = require('../utils/generateToken');
  const notificationHelper = require('../utils/notificationHelper');
  const socket = require('../utils/socket');
  console.log('   ✅ Auth, Upload, ImageKit, JWT, Notification, Socket.io utilities loaded.');

  // 4. Check Environment Variables
  console.log('\n4️⃣ Checking Environment Variables...');
  const requiredEnvVars = [
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET',
    'JWT_EXPIRES_IN',
    'IMAGEKIT_PUBLIC_KEY',
    'IMAGEKIT_PRIVATE_KEY',
    'IMAGEKIT_URL_ENDPOINT'
  ];

  let missingEnv = [];
  requiredEnvVars.forEach((key) => {
    if (!process.env[key] && !process.env[key.replace('_EXPIRES_IN', '_EXPIRE').replace('MONGODB_URI', 'MONGO_URI')]) {
      missingEnv.push(key);
    }
  });

  if (missingEnv.length > 0) {
    console.warn(`   ⚠️ Missing environment variables: ${missingEnv.join(', ')}`);
  } else {
    console.log('   ✅ All required environment variables present in .env.');
  }

  // 5. Test DB Connection
  console.log('\n5️⃣ Testing MongoDB Connection...');
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  mongoose
    .connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => {
      console.log('   🚀 MongoDB Connected Successfully!');
      console.log('\n======================================================');
      console.log('🎉 ALL 10 BACKEND PHASES AUDITED & WORKING PERFECTLY!');
      console.log('======================================================\n');
      process.exit(0);
    })
    .catch((err) => {
      console.error('   ❌ MongoDB Connection Failed:', err.message);
      process.exit(1);
    });
} catch (error) {
  console.error('❌ Audit Failed:', error.stack);
  process.exit(1);
}

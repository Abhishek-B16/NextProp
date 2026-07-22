const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./db');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

dotenv.config();

const app = express();

// Request Logger Middleware for Terminal Console Feedback
app.use((req, res, next) => {
  console.log(`📥 [${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Enable CORS for all origins in development
app.use(
  cors({
    origin: true,
    credentials: true
  })
);

// Body Parsing & Cookie Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect Database
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/wishlist', wishlistRoutes);

// API Health Check Route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected';
  res.json({
    status: 'success',
    message: 'Nestora Backend API is running smoothly',
    timestamp: new Date().toISOString(),
    database: dbStatus
  });
});

// Root Endpoint
app.get('/', (req, res) => {
  res.send('Welcome to Nestora Property Rental Backend API!');
});

const PORT = process.env.PORT || 5000;

// Bind to 0.0.0.0 to support IPv4 (127.0.0.1) and IPv6 (::1 / localhost)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server is running on http://127.0.0.1:${PORT} and http://localhost:${PORT}`);
});

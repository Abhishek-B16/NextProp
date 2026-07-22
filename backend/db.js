const mongoose = require('mongoose');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!uri || uri.includes('<username>')) {
    console.log('⚠️  MongoDB URI not configured yet in .env file.');
    console.log('ℹ️  Skipping database connection for now. Add your cluster link to .env to connect.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // 5 second timeout to prevent infinite hanging
    });
    console.log(`🚀 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
  }
};

module.exports = connectDB;

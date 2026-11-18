const mongoose = require('mongoose');

/**
 * Connect to MongoDB instance (Local or Atlas)
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/job_tracker_db', {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ [Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ [Database Error] Could not connect to MongoDB: ${error.message}`);
    console.warn('⚠️ Server will continue running, but database operations may fail until MongoDB is available.');
  }
};

module.exports = connectDB;

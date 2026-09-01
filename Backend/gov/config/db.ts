// ==========================================
// GOVERNMENT MODULE - DATABASE CONFIGURATION
// File: Backend/gov/config/db.ts
// ==========================================

/*
  PURPOSE:
  - Connect the Government & State Analytics service to MongoDB Database using Mongoose.
  
  WHAT TO IMPLEMENT LATER:
  1. Import mongoose from 'mongoose'.
  2. Read MONGODB_URI from environment variables (.env).
  3. Create an async connectDB() function.
  4. Export connectDB function.
*/

import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/samadhan_setu_gov';
    await mongoose.connect(mongoUri);
    console.log('✅ [Government Service] MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ [Government Service] MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export default connectDB;

import mongoose from 'mongoose';
import { inMemoryStore } from '../data/inMemoryStore.js';

export let isMongoDBConnected = false;

export const connectDB = async (): Promise<boolean> => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rubycare';

  try {
    mongoose.set('strictQuery', false);

    console.log(`[RubyCare DB] Attempting connection to MongoDB at: ${mongoURI}...`);

    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000
    });

    isMongoDBConnected = true;
    inMemoryStore.isDemoMode = false;
    console.log('✨ [RubyCare DB] MongoDB Connected Successfully!');
    return true;
  } catch (err: any) {
    isMongoDBConnected = false;
    inMemoryStore.isDemoMode = true;
    console.warn('⚠️ [RubyCare DB] MongoDB is unavailable or could not connect:');
    console.warn(`   Reason: ${err.message}`);
    console.info('💡 [RubyCare DB] Switching to DEMO IN-MEMORY MODE automatically.');
    console.info('   All REST endpoints (Products, Orders, Auth, Reviews, Cart) will work seamlessly in memory.');
    console.info('   To connect to a real MongoDB, ensure MongoDB is running or set MONGODB_URI in .env.');
    return false;
  }
};

import mongoose from 'mongoose';

export const connectDB = async (mongoUri) => {
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing in environment variables.');
  }

  await mongoose.connect(mongoUri, {
    dbName: 'searchboost'
  });

  console.log('MongoDB connected');
};

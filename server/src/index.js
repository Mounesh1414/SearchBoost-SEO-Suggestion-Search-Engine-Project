import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import seoRoutes from './routes/seoRoutes.js';
import suggestionRoutes from './routes/suggestions.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'SearchBoost SEO Engine API is running', version: '2.0.0' });
});

app.use('/api/auth', authRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/suggestions', suggestionRoutes); // legacy

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, () => {
      console.log(`\x1b[32m✔ MongoDB connected\x1b[0m`);
      console.log(`\x1b[36m✔ Server running on http://localhost:${PORT}\x1b[0m`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

start();

import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

import { connectDB, isMongoDBConnected } from './config/db.js';
import { inMemoryStore } from './data/inMemoryStore.js';
import { errorHandler } from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:4200';

// 1. CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost dev servers or mobile/postman tools
      if (!origin || origin.includes('localhost') || origin.includes('127.0.0.1')) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 2. Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Security: Rate limiting on authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.'
  }
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// 4. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/admin', adminRoutes);

// 5. System Health & Diagnostics Endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    application: 'RubyCare Skincare E-Commerce API',
    version: '1.0.0',
    mode: isMongoDBConnected ? 'MongoDB Production Mode' : 'Demo In-Memory Mode',
    productsCount: isMongoDBConnected ? 'Managed via MongoDB' : inMemoryStore.products.length,
    timestamp: new Date().toISOString()
  });
});

// 6. 404 Route Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint '${req.method} ${req.originalUrl}' not found.`
  });
});

// 7. Centralized Error Handler
app.use(errorHandler);

// 8. Start Server
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`🌿 RubyCare Skincare E-Commerce Backend REST API`);
    console.log(`🚀 Server running on: http://localhost:${PORT}`);
    console.log(`🌐 Allowed Client URL: ${CLIENT_URL}`);
    console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔑 Demo Admin (Root): admin@rubycare.com | Admin@123`);
    console.log(`🛡️ Demo Admin (Manager): manager@rubycare.com | Admin@123`);
    console.log(`👤 Demo Customer: customer@rubycare.com | Customer@123`);
    console.log('====================================================');
  });
};

startServer();

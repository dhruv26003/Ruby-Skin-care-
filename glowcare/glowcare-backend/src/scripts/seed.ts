import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

dotenv.config();

import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { Review } from '../models/Review.js';
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_COUPONS,
  SEED_REVIEWS
} from '../data/seedData.js';

const seedDatabase = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/rubycare';

  try {
    console.log(`[Seed] Connecting to MongoDB at ${mongoURI}...`);
    await mongoose.connect(mongoURI);
    console.log('[Seed] Connected to MongoDB!');

    // 1. Clear existing collections
    console.log('[Seed] Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Category.deleteMany({}),
      Product.deleteMany({}),
      Coupon.deleteMany({}),
      Review.deleteMany({})
    ]);

    // 2. Insert Users
    console.log('[Seed] Creating default users...');
    const adminPassword = await bcrypt.hash('Admin@123', 10);
    const customerPassword = await bcrypt.hash('Customer@123', 10);

    const adminUser = await User.create({
      name: 'RubyCare Admin',
      email: 'admin@rubycare.com',
      password: adminPassword,
      role: 'admin',
      phone: '+1 800-456-7829',
      addresses: [
        {
          street: '742 Evergreen Terrace',
          city: 'Beverly Hills',
          state: 'CA',
          postalCode: '90210',
          country: 'United States',
          isDefault: true
        }
      ]
    });

    const managerUser = await User.create({
      name: 'Operations Manager',
      email: 'manager@rubycare.com',
      password: adminPassword,
      role: 'admin',
      phone: '+91 98765 88990',
      addresses: []
    });

    const customerUser = await User.create({
      name: 'Jane Doe',
      email: 'customer@rubycare.com',
      password: customerPassword,
      role: 'customer',
      phone: '+1 555-019-2834',
      addresses: [
        {
          street: '124 Magnolia Blossom Lane',
          city: 'Austin',
          state: 'TX',
          postalCode: '78701',
          country: 'United States',
          isDefault: true
        }
      ]
    });

    // 3. Insert Categories
    console.log(`[Seed] Inserting ${SEED_CATEGORIES.length} categories...`);
    const categoryDocs = await Category.insertMany(
      SEED_CATEGORIES.map(({ id, ...cat }) => cat)
    );

    // 4. Insert Products
    console.log(`[Seed] Inserting ${SEED_PRODUCTS.length} skincare products...`);
    const createdProducts = await Product.insertMany(
      SEED_PRODUCTS.map(({ id, ...prod }) => prod)
    );

    // 5. Insert Coupons
    console.log(`[Seed] Inserting ${SEED_COUPONS.length} active coupons...`);
    await Coupon.insertMany(SEED_COUPONS);

    // 6. Insert Reviews
    console.log(`[Seed] Inserting sample customer reviews...`);
    for (const r of SEED_REVIEWS) {
      const match = createdProducts.find(
        (p) =>
          p.slug ===
          SEED_PRODUCTS.find((sp) => sp.id === r.productId)?.slug
      );
      if (match) {
        await Review.create({
          product: match._id,
          user: customerUser._id,
          userName: r.userName,
          rating: r.rating,
          title: r.title,
          comment: r.comment,
          verifiedPurchase: r.verifiedPurchase,
          status: 'approved',
          createdAt: new Date(r.createdAt)
        });
      }
    }

    console.log('✨ [Seed] Database seeded successfully with full RubyCare catalog!');
    console.log(`   Admin Login: admin@rubycare.com / Admin@123`);
    console.log(`   Customer Login: customer@rubycare.com / Customer@123`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err: any) {
    console.error('❌ [Seed] Error seeding database:', err.message);
    process.exit(1);
  }
};

seedDatabase();

import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { Review } from '../models/Review.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { isMongoDBConnected } from '../config/db.js';
import { inMemoryStore } from '../data/inMemoryStore.js';
import { protect, authorize, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Protect all admin routes
router.use(protect, authorize('admin'));

// GET /api/admin/dashboard
router.get('/dashboard', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (isMongoDBConnected) {
      const [
        totalProducts,
        totalOrders,
        totalCustomers,
        orders,
        recentOrders,
        lowStockProducts,
        pendingReviews,
        unreadMessages
      ] = await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        User.countDocuments({ role: 'customer' }),
        Order.find({ paymentStatus: 'completed' }),
        Order.find().sort({ createdAt: -1 }).limit(5),
        Product.find({ stock: { $lte: 10 } }).select('name stock price images'),
        Review.countDocuments({ status: 'pending' }),
        ContactMessage.countDocuments({ status: 'unread' })
      ]);

      const totalSales = orders.reduce((sum, order) => sum + order.total, 0);

      res.status(200).json({
        success: true,
        stats: {
          totalProducts,
          totalOrders,
          totalCustomers,
          totalSales: Math.round(totalSales * 100) / 100,
          pendingReviews,
          unreadMessages
        },
        recentOrders,
        lowStockProducts
      });
    } else {
      const totalProducts = inMemoryStore.products.length;
      const totalOrders = inMemoryStore.orders.length;
      const totalCustomers = inMemoryStore.users.filter((u) => u.role === 'customer').length;
      const totalSales = inMemoryStore.orders.reduce((sum, o) => sum + o.total, 0);
      const recentOrders = inMemoryStore.orders.slice(0, 5);
      const lowStockProducts = inMemoryStore.products.filter((p) => p.stock <= 40);
      const pendingReviews = inMemoryStore.reviews.filter((r) => r.status === 'pending').length;
      const unreadMessages = inMemoryStore.contactMessages.filter((m) => m.status === 'unread').length;

      res.status(200).json({
        success: true,
        stats: {
          totalProducts,
          totalOrders,
          totalCustomers,
          totalSales: Math.round(totalSales * 100) / 100,
          pendingReviews,
          unreadMessages
        },
        recentOrders,
        lowStockProducts
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/orders
router.get('/orders', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (isMongoDBConnected) {
      const orders = await Order.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, count: orders.length, orders });
    } else {
      res.status(200).json({
        success: true,
        count: inMemoryStore.orders.length,
        orders: inMemoryStore.orders
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/orders/:id/status
router.patch('/orders/:id/status', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber } = req.body;

    if (!orderStatus) {
      res.status(400).json({ success: false, message: 'orderStatus is required.' });
      return;
    }

    if (isMongoDBConnected) {
      const updateData: any = { orderStatus };
      if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;

      const order = await Order.findByIdAndUpdate(id, updateData, { new: true });
      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found.' });
        return;
      }

      res.status(200).json({ success: true, order });
    } else {
      const order = inMemoryStore.orders.find((o) => o._id === id || o.orderNumber === id);
      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found.' });
        return;
      }

      order.orderStatus = orderStatus;
      if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
      order.updatedAt = new Date();

      res.status(200).json({ success: true, order });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/customers
router.get('/customers', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (isMongoDBConnected) {
      const customers = await User.find({ role: 'customer' })
        .select('-password')
        .sort({ createdAt: -1 });
      res.status(200).json({ success: true, count: customers.length, customers });
    } else {
      const customers = inMemoryStore.users
        .filter((u) => u.role === 'customer')
        .map(({ password, ...rest }) => rest);
      res.status(200).json({ success: true, count: customers.length, customers });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/messages
router.get('/messages', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (isMongoDBConnected) {
      const messages = await ContactMessage.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, messages });
    } else {
      res.status(200).json({ success: true, messages: inMemoryStore.contactMessages });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/messages/:id/status
router.patch('/messages/:id/status', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isMongoDBConnected) {
      const msg = await ContactMessage.findByIdAndUpdate(id, { status }, { new: true });
      if (!msg) {
        res.status(404).json({ success: false, message: 'Message not found.' });
        return;
      }
      res.status(200).json({ success: true, message: msg });
    } else {
      const msg = inMemoryStore.contactMessages.find((m) => m._id === id);
      if (!msg) {
        res.status(404).json({ success: false, message: 'Message not found.' });
        return;
      }
      msg.status = status;
      msg.updatedAt = new Date();
      res.status(200).json({ success: true, message: msg });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/reviews
router.get('/reviews', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (isMongoDBConnected) {
      const reviews = await Review.find().populate('product', 'name images').sort({ createdAt: -1 });
      res.status(200).json({ success: true, reviews });
    } else {
      res.status(200).json({ success: true, reviews: inMemoryStore.reviews });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /api/admin/reviews/:id/status
router.patch('/reviews/:id/status', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (isMongoDBConnected) {
      const review = await Review.findByIdAndUpdate(id, { status }, { new: true });
      if (!review) {
        res.status(404).json({ success: false, message: 'Review not found.' });
        return;
      }
      res.status(200).json({ success: true, review });
    } else {
      const review = inMemoryStore.reviews.find((r) => r._id === id);
      if (!review) {
        res.status(404).json({ success: false, message: 'Review not found.' });
        return;
      }
      review.status = status;
      review.updatedAt = new Date();
      res.status(200).json({ success: true, review });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/admin/reviews/:id
router.delete('/reviews/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected) {
      const review = await Review.findByIdAndDelete(id);
      if (!review) {
        res.status(404).json({ success: false, message: 'Review not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Review deleted successfully.' });
    } else {
      const index = inMemoryStore.reviews.findIndex((r) => r._id === id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Review not found.' });
        return;
      }
      inMemoryStore.reviews.splice(index, 1);
      res.status(200).json({ success: true, message: 'Review deleted successfully.' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/admin/admins - List all administrators
router.get('/admins', async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (isMongoDBConnected) {
      const admins = await User.find({ role: 'admin' })
        .select('-password')
        .sort({ createdAt: -1 });
      res.status(200).json({ success: true, count: admins.length, admins });
    } else {
      const admins = inMemoryStore.users
        .filter((u) => u.role === 'admin')
        .map(({ password, ...rest }) => rest);
      res.status(200).json({ success: true, count: admins.length, admins });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/admin/admins - Create a new administrator
router.post('/admins', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Name, email, and password are required fields.'
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.'
      });
      return;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isMongoDBConnected) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
        return;
      }

      const newAdmin = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password, // UserSchema pre('save') hashes it
        role: 'admin',
        phone: phone ? phone.trim() : undefined,
        addresses: [],
        wishlist: []
      });

      res.status(201).json({
        success: true,
        message: `Admin account for ${newAdmin.name} created successfully!`,
        admin: {
          _id: newAdmin._id.toString(),
          id: newAdmin._id.toString(),
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          phone: newAdmin.phone,
          createdAt: newAdmin.createdAt
        }
      });
    } else {
      const existingUser = inMemoryStore.users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = {
        _id: `usr_admin_${Date.now()}`,
        id: `usr_admin_${Date.now()}`,
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role: 'admin' as const,
        phone: phone ? phone.trim() : undefined,
        addresses: [],
        wishlist: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      inMemoryStore.users.push(newAdmin);

      const { password: _, ...adminSafe } = newAdmin;
      res.status(201).json({
        success: true,
        message: `Admin account for ${newAdmin.name} created successfully!`,
        admin: adminSafe
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/admin/admins/:id - Remove an administrator
router.delete('/admins/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const currentUserId = req.user?.id || req.user?._id;

    if (id === currentUserId) {
      res.status(400).json({
        success: false,
        message: 'You cannot delete your own active administrator account.'
      });
      return;
    }

    if (isMongoDBConnected) {
      const admin = await User.findOne({ _id: id, role: 'admin' });
      if (!admin) {
        res.status(404).json({ success: false, message: 'Administrator not found.' });
        return;
      }

      if (admin.email === 'admin@rubycare.com') {
        res.status(400).json({
          success: false,
          message: 'The primary system administrator (admin@rubycare.com) cannot be deleted.'
        });
        return;
      }

      await User.findByIdAndDelete(id);
      res.status(200).json({ success: true, message: `Administrator ${admin.name} removed successfully.` });
    } else {
      const idx = inMemoryStore.users.findIndex((u) => (u._id === id || u.id === id) && u.role === 'admin');
      if (idx === -1) {
        res.status(404).json({ success: false, message: 'Administrator not found.' });
        return;
      }

      const targetAdmin = inMemoryStore.users[idx];
      if (targetAdmin.email === 'admin@rubycare.com') {
        res.status(400).json({
          success: false,
          message: 'The primary system administrator (admin@rubycare.com) cannot be deleted.'
        });
        return;
      }

      inMemoryStore.users.splice(idx, 1);
      res.status(200).json({ success: true, message: `Administrator ${targetAdmin.name} removed successfully.` });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

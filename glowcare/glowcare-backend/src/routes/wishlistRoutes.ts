import { Router, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Product } from '../models/Product.js';
import { isMongoDBConnected } from '../config/db.js';
import { inMemoryStore } from '../data/inMemoryStore.js';
import { protect, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/wishlist
router.get('/', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (isMongoDBConnected) {
      const user = await User.findById(userId).populate('wishlist');
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      res.status(200).json({ success: true, wishlist: user.wishlist });
    } else {
      const user = inMemoryStore.users.find((u) => u._id === userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }
      const wishlistProducts = inMemoryStore.products.filter((p) =>
        user.wishlist.includes(p._id) || user.wishlist.includes(p.id)
      );
      res.status(200).json({ success: true, wishlist: wishlistProducts });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/wishlist/toggle
router.post('/toggle', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productId } = req.body;

    if (!productId) {
      res.status(400).json({ success: false, message: 'Product ID is required.' });
      return;
    }

    if (isMongoDBConnected) {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      const strList = user.wishlist.map((id) => id.toString());
      const index = strList.indexOf(productId);

      let action = 'added';
      if (index > -1) {
        user.wishlist.splice(index, 1);
        action = 'removed';
      } else {
        user.wishlist.push(new mongoose.Types.ObjectId(productId));
      }

      await user.save();
      res.status(200).json({
        success: true,
        action,
        message: `Product ${action} wishlist`,
        wishlist: user.wishlist
      });
    } else {
      const user = inMemoryStore.users.find((u) => u._id === userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      const index = user.wishlist.indexOf(productId);
      let action = 'added';
      if (index > -1) {
        user.wishlist.splice(index, 1);
        action = 'removed';
      } else {
        user.wishlist.push(productId);
      }

      res.status(200).json({
        success: true,
        action,
        message: `Product ${action} wishlist`,
        wishlist: user.wishlist
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/wishlist/sync
router.post('/sync', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { productIds } = req.body;

    if (!Array.isArray(productIds)) {
      res.status(400).json({ success: false, message: 'productIds array is required.' });
      return;
    }

    if (isMongoDBConnected) {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      const current = user.wishlist.map((id) => id.toString());
      for (const pid of productIds) {
        if (!current.includes(pid) && mongoose.Types.ObjectId.isValid(pid)) {
          user.wishlist.push(new mongoose.Types.ObjectId(pid));
        }
      }

      await user.save();
      res.status(200).json({ success: true, wishlist: user.wishlist });
    } else {
      const user = inMemoryStore.users.find((u) => u._id === userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
        return;
      }

      for (const pid of productIds) {
        if (!user.wishlist.includes(pid)) {
          user.wishlist.push(pid);
        }
      }

      res.status(200).json({ success: true, wishlist: user.wishlist });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

import { Router, Request, Response } from 'express';
import { Coupon } from '../models/Coupon.js';
import { isMongoDBConnected } from '../config/db.js';
import { inMemoryStore } from '../data/inMemoryStore.js';
import { protect, authorize, AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/coupons/validate
router.post('/validate', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, orderSubtotal } = req.body;

    if (!code) {
      res.status(400).json({ success: false, message: 'Please provide a promo code.' });
      return;
    }

    const subtotal = parseFloat(orderSubtotal) || 0;
    const cleanCode = code.toUpperCase().trim();

    let coupon: any = null;

    if (isMongoDBConnected) {
      coupon = await Coupon.findOne({ code: cleanCode, isActive: true });
    } else {
      coupon = inMemoryStore.coupons.find(
        (c) => c.code === cleanCode && c.isActive
      );
    }

    if (!coupon) {
      res.status(404).json({
        success: false,
        message: 'Invalid promo code. Please check and try again.'
      });
      return;
    }

    const now = new Date();
    const expiry = new Date(coupon.expiresAt);
    if (now > expiry) {
      res.status(400).json({
        success: false,
        message: 'This promo code has expired.'
      });
      return;
    }

    if (subtotal < coupon.minOrderValue) {
      res.status(400).json({
        success: false,
        message: `This coupon requires a minimum subtotal of $${coupon.minOrderValue.toFixed(2)}.`
      });
      return;
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    discountAmount = Math.min(discountAmount, subtotal);
    discountAmount = Math.round(discountAmount * 100) / 100;

    res.status(200).json({
      success: true,
      message: `Coupon '${coupon.code}' applied successfully!`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/coupons (Admin)
router.get('/', protect, authorize('admin'), async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (isMongoDBConnected) {
      const coupons = await Coupon.find().sort({ createdAt: -1 });
      res.status(200).json({ success: true, coupons });
    } else {
      res.status(200).json({ success: true, coupons: inMemoryStore.coupons });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/coupons (Admin)
router.post('/', protect, authorize('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = req.body;
    if (!data.code || !data.discountType || data.discountValue === undefined) {
      res.status(400).json({
        success: false,
        message: 'Code, discountType, and discountValue are required.'
      });
      return;
    }

    const cleanCode = data.code.toUpperCase().trim();
    const expiry = data.expiresAt ? new Date(data.expiresAt) : new Date(Date.now() + 365 * 86400000);

    if (isMongoDBConnected) {
      const existing = await Coupon.findOne({ code: cleanCode });
      if (existing) {
        res.status(400).json({ success: false, message: 'Coupon code already exists.' });
        return;
      }

      const coupon = await Coupon.create({
        ...data,
        code: cleanCode,
        expiresAt: expiry
      });
      res.status(201).json({ success: true, coupon });
    } else {
      const existing = inMemoryStore.coupons.find((c) => c.code === cleanCode);
      if (existing) {
        res.status(400).json({ success: false, message: 'Coupon code already exists.' });
        return;
      }

      const coupon = {
        _id: `coupon_${Date.now()}`,
        code: cleanCode,
        discountType: data.discountType,
        discountValue: Number(data.discountValue),
        minOrderValue: Number(data.minOrderValue) || 0,
        maxDiscount: data.maxDiscount ? Number(data.maxDiscount) : undefined,
        expiresAt: expiry.toISOString(),
        isActive: data.isActive !== undefined ? !!data.isActive : true
      };

      inMemoryStore.coupons.push(coupon);
      res.status(201).json({ success: true, coupon });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

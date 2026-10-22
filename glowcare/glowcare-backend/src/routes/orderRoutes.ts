import { Router, Response } from 'express';
import { Order, IOrderItem } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { isMongoDBConnected } from '../config/db.js';
import { inMemoryStore } from '../data/inMemoryStore.js';
import { protect, optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/orders
// Places an order with strict server-side price & coupon recalculation
router.post('/', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { items, shippingAddress, couponCode, paymentMethod, notes } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ success: false, message: 'Your cart contains no items.' });
      return;
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street || !shippingAddress.city || !shippingAddress.postalCode) {
      res.status(400).json({
        success: false,
        message: 'A complete shipping address is required.'
      });
      return;
    }

    // 1. Fetch valid products and calculate subtotal securely on server
    const processedItems: any[] = [];
    let calculatedSubtotal = 0;

    for (const item of items) {
      const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
      const targetId = item.productId || item.product || item.id || item._id;

      let product: any = null;
      if (isMongoDBConnected) {
        if (typeof targetId === 'string' && targetId.match(/^[0-9a-fA-F]{24}$/)) {
          product = await Product.findById(targetId);
        }
        if (!product) {
          product = await Product.findOne({ slug: targetId });
        }
      } else {
        product = inMemoryStore.products.find(
          (p) => p._id === targetId || p.id === targetId || p.slug === targetId
        );
      }

      if (!product) {
        res.status(400).json({
          success: false,
          message: `Product '${item.name || targetId}' is no longer available in catalog.`
        });
        return;
      }

      if (product.stock < quantity) {
        res.status(400).json({
          success: false,
          message: `Only ${product.stock} units remaining for '${product.name}'.`
        });
        return;
      }

      const unitPrice = product.onSale && product.salePrice ? product.salePrice : product.price;
      const lineTotal = unitPrice * quantity;
      calculatedSubtotal += lineTotal;

      processedItems.push({
        product: product._id || product.id,
        name: product.name,
        price: unitPrice,
        quantity,
        image: product.images?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
        size: product.size
      });
    }

    calculatedSubtotal = Math.round(calculatedSubtotal * 100) / 100;

    // 2. Validate Coupon and recalculate discount on server
    let calculatedDiscount = 0;
    let appliedCouponCode: string | undefined;

    if (couponCode) {
      const cleanCode = couponCode.toUpperCase().trim();
      let coupon: any = null;

      if (isMongoDBConnected) {
        coupon = await Coupon.findOne({ code: cleanCode, isActive: true });
      } else {
        coupon = inMemoryStore.coupons.find((c) => c.code === cleanCode && c.isActive);
      }

      if (coupon && new Date() <= new Date(coupon.expiresAt) && calculatedSubtotal >= coupon.minOrderValue) {
        appliedCouponCode = coupon.code;
        if (coupon.discountType === 'percentage') {
          calculatedDiscount = (calculatedSubtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && calculatedDiscount > coupon.maxDiscount) {
            calculatedDiscount = coupon.maxDiscount;
          }
        } else {
          calculatedDiscount = coupon.discountValue;
        }
        calculatedDiscount = Math.min(calculatedDiscount, calculatedSubtotal);
        calculatedDiscount = Math.round(calculatedDiscount * 100) / 100;
      }
    }

    // 3. Shipping fee calculation (Free shipping over ₹999)
    const discountedSubtotal = calculatedSubtotal - calculatedDiscount;
    const shippingFee = discountedSubtotal >= 999 ? 0 : 99.0;
    const calculatedTotal = Math.round((discountedSubtotal + shippingFee) * 100) / 100;

    // 4. Generate order number
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `RUBY-${randomSuffix}`;

    // 5. Decrement inventory
    for (const item of processedItems) {
      if (isMongoDBConnected) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity }
        });
      } else {
        const p = inMemoryStore.products.find((prod) => prod._id === item.product || prod.id === item.product);
        if (p) {
          p.stock = Math.max(0, p.stock - item.quantity);
        }
      }
    }

    // 6. Save order
    const orderData: any = {
      orderNumber,
      user: req.user ? req.user.id : undefined,
      guestEmail: !req.user ? shippingAddress.email : undefined,
      guestName: !req.user ? shippingAddress.fullName : undefined,
      items: processedItems,
      shippingAddress: {
        fullName: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone || '+1 555-019-0000',
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state || 'CA',
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country || 'United States'
      },
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      couponCode: appliedCouponCode,
      shippingFee,
      total: calculatedTotal,
      paymentMethod: paymentMethod || 'Demo Card / Cash on Delivery',
      paymentStatus: 'completed',
      orderStatus: 'Processing',
      notes: notes || undefined
    };

    if (isMongoDBConnected) {
      const newOrder = await Order.create(orderData);
      res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        order: newOrder
      });
    } else {
      const now = new Date();
      const inMemOrder = {
        _id: `ord_${Date.now()}`,
        ...orderData,
        createdAt: now,
        updatedAt: now
      };
      inMemoryStore.orders.unshift(inMemOrder);
      res.status(201).json({
        success: true,
        message: 'Order placed successfully! (Demo Mode)',
        order: inMemOrder
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/orders/my-orders
router.get('/my-orders', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (isMongoDBConnected) {
      const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
      res.status(200).json({ success: true, count: orders.length, orders });
    } else {
      const orders = inMemoryStore.orders.filter((o) => o.user === userId || o.guestEmail === req.user?.email);
      res.status(200).json({ success: true, count: orders.length, orders });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/orders/:id
router.get('/:id', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected) {
      let order = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        order = await Order.findById(id);
      }
      if (!order) {
        order = await Order.findOne({ orderNumber: id });
      }

      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found.' });
        return;
      }

      res.status(200).json({ success: true, order });
    } else {
      const order = inMemoryStore.orders.find(
        (o) => o._id === id || o.orderNumber === id
      );

      if (!order) {
        res.status(404).json({ success: false, message: 'Order not found.' });
        return;
      }

      res.status(200).json({ success: true, order });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

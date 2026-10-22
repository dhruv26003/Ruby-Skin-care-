import { Router, Request, Response } from 'express';
import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';
import { isMongoDBConnected } from '../config/db.js';
import { inMemoryStore } from '../data/inMemoryStore.js';
import { protect, optionalAuth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/reviews/product/:productId
router.get('/product/:productId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;

    if (isMongoDBConnected) {
      const reviews = await Review.find({
        product: productId,
        status: 'approved'
      }).sort({ createdAt: -1 });

      res.status(200).json({ success: true, count: reviews.length, reviews });
    } else {
      const reviews = inMemoryStore.reviews.filter(
        (r) => (r.product === productId) && r.status === 'approved'
      );
      res.status(200).json({ success: true, count: reviews.length, reviews });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/reviews
router.post('/', optionalAuth, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId, rating, title, comment, userName } = req.body;

    if (!productId || !rating || !title || !comment) {
      res.status(400).json({
        success: false,
        message: 'Product, rating, title, and comment are required.'
      });
      return;
    }

    const reviewerName = req.user?.name || userName || 'Verified Customer';
    const numRating = Math.max(1, Math.min(5, Number(rating)));

    if (isMongoDBConnected) {
      const review = await Review.create({
        product: productId,
        user: req.user ? req.user.id : undefined,
        userName: reviewerName,
        rating: numRating,
        title: title.trim(),
        comment: comment.trim(),
        verifiedPurchase: true,
        status: 'approved'
      });

      // Update product rating and review count
      const allReviews = await Review.find({ product: productId, status: 'approved' });
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);

      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length
      });

      res.status(201).json({
        success: true,
        message: 'Review submitted successfully. Thank you for your feedback!',
        review
      });
    } else {
      const now = new Date();
      const newReview = {
        _id: `rev_${Date.now()}`,
        product: productId,
        user: req.user?.id,
        userName: reviewerName,
        rating: numRating,
        title: title.trim(),
        comment: comment.trim(),
        verifiedPurchase: true,
        status: 'approved' as const,
        createdAt: now,
        updatedAt: now
      };

      inMemoryStore.reviews.unshift(newReview);

      // Recalculate average rating for in-memory product
      const productReviews = inMemoryStore.reviews.filter((r) => r.product === productId && r.status === 'approved');
      const avg = productReviews.reduce((acc, r) => acc + r.rating, 0) / (productReviews.length || 1);
      const prod = inMemoryStore.products.find((p) => p._id === productId || p.id === productId);
      if (prod) {
        prod.rating = Math.round(avg * 10) / 10;
        prod.reviewCount = productReviews.length;
      }

      res.status(201).json({
        success: true,
        message: 'Review submitted successfully! (Demo Mode)',
        review: newReview
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

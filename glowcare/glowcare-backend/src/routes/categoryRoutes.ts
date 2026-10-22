import { Router, Request, Response } from 'express';
import { Category } from '../models/Category.js';
import { isMongoDBConnected } from '../config/db.js';
import { inMemoryStore } from '../data/inMemoryStore.js';
import { protect, authorize, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/categories
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    if (isMongoDBConnected) {
      const categories = await Category.find().sort({ name: 1 });
      res.status(200).json({ success: true, count: categories.length, categories });
    } else {
      res.status(200).json({
        success: true,
        count: inMemoryStore.categories.length,
        categories: inMemoryStore.categories
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/categories (Admin)
router.post('/', protect, authorize('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      res.status(400).json({ success: false, message: 'Category name is required.' });
      return;
    }

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (isMongoDBConnected) {
      const category = await Category.create({ name, slug, description, image });
      res.status(201).json({ success: true, category });
    } else {
      const newCat = {
        id: `cat_${Date.now()}`,
        name,
        slug,
        description: description || '',
        image:
          image ||
          'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80'
      };
      inMemoryStore.categories.push(newCat);
      res.status(201).json({ success: true, category: newCat });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/categories/:id (Admin)
router.put('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, image } = req.body;

    if (isMongoDBConnected) {
      const category = await Category.findByIdAndUpdate(
        id,
        { name, description, image },
        { new: true }
      );
      if (!category) {
        res.status(404).json({ success: false, message: 'Category not found.' });
        return;
      }
      res.status(200).json({ success: true, category });
    } else {
      const cat = inMemoryStore.categories.find((c) => c.id === id || c.slug === id);
      if (!cat) {
        res.status(404).json({ success: false, message: 'Category not found.' });
        return;
      }
      if (name) cat.name = name;
      if (description !== undefined) cat.description = description;
      if (image !== undefined) cat.image = image;
      res.status(200).json({ success: true, category: cat });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/categories/:id (Admin)
router.delete('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected) {
      const category = await Category.findByIdAndDelete(id);
      if (!category) {
        res.status(404).json({ success: false, message: 'Category not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Category deleted successfully.' });
    } else {
      const index = inMemoryStore.categories.findIndex((c) => c.id === id || c.slug === id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Category not found.' });
        return;
      }
      inMemoryStore.categories.splice(index, 1);
      res.status(200).json({ success: true, message: 'Category deleted successfully.' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

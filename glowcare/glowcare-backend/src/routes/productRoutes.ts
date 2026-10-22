import { Router, Request, Response } from 'express';
import { Product } from '../models/Product.js';
import { isMongoDBConnected } from '../config/db.js';
import { inMemoryStore } from '../data/inMemoryStore.js';
import { protect, authorize, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/products/featured
router.get('/featured', async (_req: Request, res: Response): Promise<void> => {
  try {
    if (isMongoDBConnected) {
      const products = await Product.find({ isFeatured: true }).limit(8);
      res.status(200).json({ success: true, count: products.length, products });
    } else {
      const products = inMemoryStore.products.filter((p) => p.isFeatured).slice(0, 8);
      res.status(200).json({ success: true, count: products.length, products });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products/bestsellers
router.get('/bestsellers', async (_req: Request, res: Response): Promise<void> => {
  try {
    if (isMongoDBConnected) {
      const products = await Product.find({ isBestseller: true }).limit(8);
      res.status(200).json({ success: true, count: products.length, products });
    } else {
      const products = inMemoryStore.products.filter((p) => p.isBestseller).slice(0, 8);
      res.status(200).json({ success: true, count: products.length, products });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products/new-arrivals
router.get('/new-arrivals', async (_req: Request, res: Response): Promise<void> => {
  try {
    if (isMongoDBConnected) {
      const products = await Product.find({ isNewArrival: true }).limit(8);
      res.status(200).json({ success: true, count: products.length, products });
    } else {
      const products = inMemoryStore.products.filter((p) => p.isNewArrival).slice(0, 8);
      res.status(200).json({ success: true, count: products.length, products });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      search,
      category,
      skinConcern,
      skinType,
      minPrice,
      maxPrice,
      onSale,
      sort,
      page = '1',
      limit = '12'
    } = req.query as Record<string, string | undefined>;

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 12;

    if (isMongoDBConnected) {
      const filter: any = {};

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { ingredients: { $regex: search, $options: 'i' } }
        ];
      }

      if (category && category !== 'all') {
        filter.categorySlug = category.toLowerCase();
      }

      if (skinConcern && skinConcern !== 'all') {
        filter.skinConcerns = { $regex: skinConcern, $options: 'i' };
      }

      if (skinType && skinType !== 'all') {
        filter.skinTypes = { $regex: skinType, $options: 'i' };
      }

      if (onSale === 'true') {
        filter.onSale = true;
      }

      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = parseFloat(minPrice);
        if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
      }

      let sortOptions: any = { createdAt: -1 };
      if (sort === 'price-asc') sortOptions = { price: 1 };
      else if (sort === 'price-desc') sortOptions = { price: -1 };
      else if (sort === 'rating') sortOptions = { rating: -1, reviewCount: -1 };
      else if (sort === 'popular') sortOptions = { isBestseller: -1, reviewCount: -1 };
      else if (sort === 'newest') sortOptions = { createdAt: -1 };

      const total = await Product.countDocuments(filter);
      const totalPages = Math.ceil(total / limitNum);
      const products = await Product.find(filter)
        .sort(sortOptions)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      res.status(200).json({
        success: true,
        count: products.length,
        total,
        page: pageNum,
        totalPages,
        products
      });
    } else {
      let filtered = [...inMemoryStore.products];

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.ingredients.some((ing) => ing.toLowerCase().includes(q))
        );
      }

      if (category && category !== 'all') {
        const cat = category.toLowerCase();
        filtered = filtered.filter((p) => p.categorySlug.toLowerCase() === cat);
      }

      if (skinConcern && skinConcern !== 'all') {
        const concern = skinConcern.toLowerCase();
        filtered = filtered.filter((p) =>
          p.skinConcerns.some((c) => c.toLowerCase().includes(concern))
        );
      }

      if (skinType && skinType !== 'all') {
        const type = skinType.toLowerCase();
        filtered = filtered.filter((p) =>
          p.skinTypes.some((t) => t.toLowerCase().includes(type) || t === 'All Skin Types')
        );
      }

      if (onSale === 'true') {
        filtered = filtered.filter((p) => p.onSale);
      }

      if (minPrice) {
        const min = parseFloat(minPrice);
        filtered = filtered.filter((p) => (p.salePrice || p.price) >= min);
      }

      if (maxPrice) {
        const max = parseFloat(maxPrice);
        filtered = filtered.filter((p) => (p.salePrice || p.price) <= max);
      }

      if (sort === 'price-asc') {
        filtered.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
      } else if (sort === 'price-desc') {
        filtered.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
      } else if (sort === 'rating') {
        filtered.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
      } else if (sort === 'popular') {
        filtered.sort(
          (a, b) =>
            (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0) || b.reviewCount - a.reviewCount
        );
      } else {
        // newest
        filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }

      const total = filtered.length;
      const totalPages = Math.ceil(total / limitNum) || 1;
      const paginated = filtered.slice((pageNum - 1) * limitNum, pageNum * limitNum);

      res.status(200).json({
        success: true,
        count: paginated.length,
        total,
        page: pageNum,
        totalPages,
        products: paginated
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected) {
      let product = null;
      if (id.match(/^[0-9a-fA-F]{24}$/)) {
        product = await Product.findById(id);
      }
      if (!product) {
        product = await Product.findOne({ slug: id });
      }

      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found.' });
        return;
      }

      // Fetch related products from same category
      const related = await Product.find({
        categorySlug: product.categorySlug,
        _id: { $ne: product._id }
      }).limit(4);

      res.status(200).json({ success: true, product, related });
    } else {
      const product = inMemoryStore.products.find(
        (p) => p._id === id || p.id === id || p.slug === id
      );

      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found.' });
        return;
      }

      const related = inMemoryStore.products
        .filter((p) => p.categorySlug === product.categorySlug && p._id !== product._id)
        .slice(0, 4);

      res.status(200).json({ success: true, product, related });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/products (Admin)
router.post('/', protect, authorize('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const data = req.body;
    if (!data.name || !data.price || !data.category || !data.description) {
      res.status(400).json({
        success: false,
        message: 'Name, price, category, and description are required.'
      });
      return;
    }

    const slug =
      data.slug ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const categorySlug =
      data.categorySlug ||
      data.category
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    if (isMongoDBConnected) {
      const newProduct = await Product.create({
        ...data,
        slug,
        categorySlug,
        onSale: !!data.salePrice && data.salePrice < data.price
      });
      res.status(201).json({ success: true, product: newProduct });
    } else {
      const id = `prod_${Date.now()}`;
      const now = new Date();
      const newProduct: any = {
        id,
        _id: id,
        ...data,
        slug,
        categorySlug,
        onSale: !!data.salePrice && data.salePrice < data.price,
        rating: data.rating || 5.0,
        reviewCount: data.reviewCount || 0,
        stock: data.stock !== undefined ? data.stock : 25,
        isFeatured: !!data.isFeatured,
        isBestseller: !!data.isBestseller,
        isNewArrival: true,
        images: data.images && data.images.length > 0 ? data.images : [
          'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80'
        ],
        ingredients: data.ingredients || [],
        benefits: data.benefits || [],
        skinTypes: data.skinTypes || ['All Skin Types'],
        skinConcerns: data.skinConcerns || [],
        createdAt: now,
        updatedAt: now
      };
      inMemoryStore.products.unshift(newProduct);
      res.status(201).json({ success: true, product: newProduct });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/products/:id (Admin)
router.put('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const data = req.body;

    if (data.salePrice !== undefined) {
      data.onSale = data.salePrice > 0 && data.salePrice < (data.price || 9999);
    }

    if (isMongoDBConnected) {
      const product = await Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found.' });
        return;
      }
      res.status(200).json({ success: true, product });
    } else {
      const index = inMemoryStore.products.findIndex((p) => p._id === id || p.id === id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Product not found.' });
        return;
      }

      inMemoryStore.products[index] = {
        ...inMemoryStore.products[index],
        ...data,
        updatedAt: new Date()
      };
      res.status(200).json({ success: true, product: inMemoryStore.products[index] });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/products/:id (Admin)
router.delete('/:id', protect, authorize('admin'), async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (isMongoDBConnected) {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        res.status(404).json({ success: false, message: 'Product not found.' });
        return;
      }
      res.status(200).json({ success: true, message: 'Product deleted successfully.' });
    } else {
      const index = inMemoryStore.products.findIndex((p) => p._id === id || p.id === id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Product not found.' });
        return;
      }

      inMemoryStore.products.splice(index, 1);
      res.status(200).json({ success: true, message: 'Product deleted successfully.' });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

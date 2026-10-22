import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { isMongoDBConnected } from '../config/db.js';
import { inMemoryStore } from '../data/inMemoryStore.js';
import { protect, generateToken, AuthRequest } from '../middleware/auth.js';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: AuthRequest, res: Response): Promise<void> => {
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

    const normalizedEmail = email.toLowerCase().trim();

    if (isMongoDBConnected) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
        return;
      }

      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        phone: phone ? phone.trim() : undefined,
        role: 'customer'
      });

      const token = generateToken(user._id.toString(), user.role);

      res.status(201).json({
        success: true,
        message: 'Registration successful! Welcome to RubyCare.',
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          addresses: user.addresses,
          wishlist: user.wishlist
        }
      });
    } else {
      const existing = inMemoryStore.users.find((u) => u.email === normalizedEmail);
      if (existing) {
        res.status(400).json({
          success: false,
          message: 'An account with this email address already exists.'
        });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = {
        _id: `usr_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: 'customer' as const,
        phone: phone ? phone.trim() : undefined,
        addresses: [],
        wishlist: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      inMemoryStore.users.push(newUser);
      const token = generateToken(newUser._id, newUser.role);

      res.status(201).json({
        success: true,
        message: 'Registration successful! (Demo Mode)',
        token,
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          phone: newUser.phone,
          addresses: newUser.addresses,
          wishlist: newUser.wishlist
        }
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during registration.'
    });
  }
});

// POST /api/auth/login
router.post('/login', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide both email and password.'
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isMongoDBConnected) {
      const user = await User.findOne({ email: normalizedEmail }).select('+password');
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
        return;
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
        return;
      }

      const token = generateToken(user._id.toString(), user.role);

      res.status(200).json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          addresses: user.addresses,
          wishlist: user.wishlist
        }
      });
    } else {
      const user = inMemoryStore.users.find((u) => u.email === normalizedEmail);
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password.'
        });
        return;
      }

      const token = generateToken(user._id, user.role);

      res.status(200).json({
        success: true,
        message: 'Logged in successfully (Demo Mode).',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          addresses: user.addresses,
          wishlist: user.wishlist
        }
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error during login.'
    });
  }
});

// GET /api/auth/me
router.get('/me', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (isMongoDBConnected) {
      const user = await User.findById(req.user?.id).select('-password');
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }
      res.status(200).json({
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          addresses: user.addresses,
          wishlist: user.wishlist
        }
      });
    } else {
      const user = inMemoryStore.users.find((u) => u._id === req.user?.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }
      res.status(200).json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          addresses: user.addresses,
          wishlist: user.wishlist
        }
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/auth/me
router.put('/me', protect, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, phone, addresses } = req.body;

    if (isMongoDBConnected) {
      const user = await User.findById(req.user?.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      if (name) user.name = name.trim();
      if (phone !== undefined) user.phone = phone.trim();
      if (addresses && Array.isArray(addresses)) user.addresses = addresses;

      await user.save();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          addresses: user.addresses,
          wishlist: user.wishlist
        }
      });
    } else {
      const user = inMemoryStore.users.find((u) => u._id === req.user?.id);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      if (name) user.name = name.trim();
      if (phone !== undefined) user.phone = phone.trim();
      if (addresses && Array.isArray(addresses)) user.addresses = addresses;
      user.updatedAt = new Date();

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully (Demo Mode).',
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          addresses: user.addresses,
          wishlist: user.wishlist
        }
      });
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req: AuthRequest, res: Response): Promise<void> => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ success: false, message: 'Please provide your email address.' });
    return;
  }

  // Safe demo response
  res.status(200).json({
    success: true,
    message: 'If an account exists with this email, a password reset link has been dispatched.',
    demoNote: 'In this college demonstration environment, password reset emails are simulated. For live testing, you may log in with admin@rubycare.com (Admin@123) or customer@rubycare.com (Customer@123).'
  });
});

export default router;

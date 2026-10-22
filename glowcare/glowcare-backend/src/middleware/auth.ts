import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { isMongoDBConnected } from '../config/db.js';
import { inMemoryStore, InMemoryUser } from '../data/inMemoryStore.js';

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

const JWT_SECRET = process.env.JWT_SECRET || 'rubycare_super_secret_jwt_key_2026_skincare_app';

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: 'Access denied. Please log in to access this resource.'
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: 'customer' | 'admin' };

    if (isMongoDBConnected) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists.'
        });
        return;
      }
      req.user = {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      };
    } else {
      const memUser = inMemoryStore.users.find((u) => u._id === decoded.id);
      if (!memUser) {
        res.status(401).json({
          success: false,
          message: 'The user belonging to this token no longer exists.'
        });
        return;
      }
      req.user = {
        id: memUser._id,
        name: memUser.name,
        email: memUser.email,
        role: memUser.role,
        phone: memUser.phone
      };
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please sign in again.'
    });
    return;
  }
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
    if (isMongoDBConnected) {
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        };
      }
    } else {
      const memUser = inMemoryStore.users.find((u) => u._id === decoded.id);
      if (memUser) {
        req.user = {
          id: memUser._id,
          name: memUser.name,
          email: memUser.email,
          role: memUser.role,
          phone: memUser.phone
        };
      }
    }
  } catch {
    // Continue as guest
  }

  next();
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required for this operation.'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user.role}' is not authorized to access this resource.`
      });
      return;
    }

    next();
  };
};

export const generateToken = (id: string, role: string): string => {
  return jwt.sign({ id, role }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

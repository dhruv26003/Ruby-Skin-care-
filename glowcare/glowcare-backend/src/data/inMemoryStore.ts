import bcrypt from 'bcryptjs';
import {
  SEED_CATEGORIES,
  SEED_PRODUCTS,
  SEED_COUPONS,
  SEED_REVIEWS,
  ISeedCategory,
  ISeedProduct,
  ISeedCoupon
} from './seedData.js';

export interface InMemoryUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'customer' | 'admin';
  phone?: string;
  addresses: Array<{
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault?: boolean;
  }>;
  wishlist: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface InMemoryOrder {
  _id: string;
  orderNumber: string;
  user?: string;
  guestEmail?: string;
  guestName?: string;
  items: Array<{
    product: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    size?: string;
  }>;
  shippingAddress: {
    fullName: string;
    email: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  trackingNumber?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InMemoryReview {
  _id: string;
  product: string;
  user?: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface InMemoryContact {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: Date;
  updatedAt: Date;
}

class InMemoryStore {
  public isDemoMode: boolean = false;
  public categories: ISeedCategory[] = [];
  public products: (ISeedProduct & { _id: string; createdAt: Date; updatedAt: Date })[] = [];
  public users: InMemoryUser[] = [];
  public orders: InMemoryOrder[] = [];
  public reviews: InMemoryReview[] = [];
  public coupons: (ISeedCoupon & { _id: string })[] = [];
  public contactMessages: InMemoryContact[] = [];
  public subscribers: string[] = [];

  constructor() {
    this.reset();
  }

  public async reset() {
    this.categories = JSON.parse(JSON.stringify(SEED_CATEGORIES));

    const now = new Date();
    this.products = SEED_PRODUCTS.map((p) => ({
      ...p,
      _id: p.id,
      createdAt: now,
      updatedAt: now
    }));

    this.coupons = SEED_COUPONS.map((c, i) => ({
      ...c,
      _id: `coupon_${i + 1}`
    }));

    this.reviews = SEED_REVIEWS.map((r, i) => ({
      _id: `rev_${i + 1}`,
      product: r.productId,
      userName: r.userName,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      verifiedPurchase: r.verifiedPurchase,
      status: 'approved',
      createdAt: new Date(r.createdAt),
      updatedAt: new Date(r.createdAt)
    }));

    const hashedPasswordAdmin = await bcrypt.hash('Admin@123', 10);
    const hashedPasswordCustomer = await bcrypt.hash('Customer@123', 10);

    this.users = [
      {
        _id: 'usr_admin',
        name: 'RubyCare Admin',
        email: 'admin@rubycare.com',
        password: hashedPasswordAdmin,
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
        ],
        wishlist: ['prod_01', 'prod_04'],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'usr_admin_manager',
        name: 'Operations Manager',
        email: 'manager@rubycare.com',
        password: hashedPasswordAdmin,
        role: 'admin',
        phone: '+91 98765 88990',
        addresses: [],
        wishlist: [],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        _id: 'usr_customer',
        name: 'Jane Doe',
        email: 'customer@rubycare.com',
        password: hashedPasswordCustomer,
        role: 'customer',
        phone: '+91 98765 43210',
        addresses: [
          {
            street: '42, Marine Drive, Nariman Point',
            city: 'Mumbai',
            state: 'Maharashtra',
            postalCode: '400021',
            country: 'India',
            isDefault: true
          }
        ],
        wishlist: ['prod_02', 'prod_08'],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    this.orders = [
      {
        _id: 'ord_1001',
        orderNumber: 'RUBY-92841',
        user: 'usr_customer',
        guestEmail: undefined,
        guestName: undefined,
        items: [
          {
            product: 'prod_01',
            name: 'Radiance C+ Brightening Elixir Serum',
            price: 1299.0,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
            size: '30 ml'
          },
          {
            product: 'prod_04',
            name: 'Invisible Sheer Mineral Sunscreen SPF 50+',
            price: 999.0,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1598662957563-ee4965d4d72c?auto=format&fit=crop&w=800&q=80',
            size: '50 ml'
          }
        ],
        shippingAddress: {
          fullName: 'Jane Doe',
          email: 'customer@rubycare.com',
          phone: '+91 98765 43210',
          street: '42, Marine Drive, Nariman Point',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400021',
          country: 'India'
        },
        subtotal: 2298.0,
        discount: 229.8,
        couponCode: 'RUBY10',
        shippingFee: 0,
        total: 2068.2,
        paymentMethod: 'Demo Card',
        paymentStatus: 'completed',
        orderStatus: 'Delivered',
        trackingNumber: 'TRK-98172648',
        notes: 'Please leave at front doorstep.',
        createdAt: new Date('2026-10-10T12:00:00Z'),
        updatedAt: new Date('2026-10-14T14:30:00Z')
      },
      {
        _id: 'ord_1002',
        orderNumber: 'RUBY-93412',
        user: 'usr_customer',
        guestEmail: undefined,
        guestName: undefined,
        items: [
          {
            product: 'prod_02',
            name: 'Cloud Hydration Barrier Repair Cream',
            price: 1599.0,
            quantity: 2,
            image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80',
            size: '50 ml'
          }
        ],
        shippingAddress: {
          fullName: 'Jane Doe',
          email: 'customer@rubycare.com',
          phone: '+91 98765 43210',
          street: '42, Marine Drive, Nariman Point',
          city: 'Mumbai',
          state: 'Maharashtra',
          postalCode: '400021',
          country: 'India'
        },
        subtotal: 3198.0,
        discount: 500.0,
        couponCode: 'WELCOME20',
        shippingFee: 0,
        total: 2698.0,
        paymentMethod: 'Demo Card',
        paymentStatus: 'completed',
        orderStatus: 'Processing',
        trackingNumber: 'TRK-98401923',
        createdAt: new Date('2026-10-20T16:15:00Z'),
        updatedAt: new Date('2026-10-20T16:15:00Z')
      }
    ];

    this.contactMessages = [
      {
        _id: 'msg_01',
        name: 'Sarah Jenkins',
        email: 'sarah.j@example.com',
        subject: 'Ingredient inquiry for sensitive skin',
        message: 'Hello, is the Radiance C+ serum suitable for rosacea-prone skin? Thank you!',
        status: 'read',
        createdAt: new Date('2026-10-18T11:20:00Z'),
        updatedAt: new Date('2026-10-18T11:20:00Z')
      }
    ];

    this.subscribers = ['sarah.j@example.com', 'claire.beauty@example.com'];
  }
}

export const inMemoryStore = new InMemoryStore();

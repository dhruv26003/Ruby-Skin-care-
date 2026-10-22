import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  salePrice?: number;
  onSale: boolean;
  rating: number;
  reviewCount: number;
  description: string;
  shortDescription: string;
  images: string[];
  ingredients: string[];
  benefits: string[];
  usageInstructions: string;
  skinTypes: string[];
  skinConcerns: string[];
  stock: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isNewArrival: boolean;
  size: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [120, 'Product name cannot exceed 120 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Product category is required']
    },
    categorySlug: {
      type: String,
      required: true,
      lowercase: true
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price must be positive']
    },
    salePrice: {
      type: Number,
      min: [0, 'Sale price must be positive']
    },
    onSale: {
      type: Boolean,
      default: false
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    description: {
      type: String,
      required: [true, 'Product description is required']
    },
    shortDescription: {
      type: String,
      default: ''
    },
    images: {
      type: [String],
      required: [true, 'At least one product image is required']
    },
    ingredients: {
      type: [String],
      default: []
    },
    benefits: {
      type: [String],
      default: []
    },
    usageInstructions: {
      type: String,
      default: ''
    },
    skinTypes: {
      type: [String],
      default: ['All Skin Types']
    },
    skinConcerns: {
      type: [String],
      default: []
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    isBestseller: {
      type: Boolean,
      default: false
    },
    isNewArrival: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: '50 ml'
    }
  },
  {
    timestamps: true
  }
);

ProductSchema.index({ name: 'text', description: 'text', ingredients: 'text' });
ProductSchema.index({ categorySlug: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ rating: -1 });

export const Product = mongoose.model<IProduct>('Product', ProductSchema);

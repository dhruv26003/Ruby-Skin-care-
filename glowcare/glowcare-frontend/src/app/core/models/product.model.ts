export interface Product {
  id?: string;
  _id?: string;
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
  shortDescription?: string;
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
}

export interface ProductsResponse {
  success: boolean;
  count: number;
  total: number;
  page: number;
  totalPages: number;
  products: Product[];
}

export interface ProductDetailResponse {
  success: boolean;
  product: Product;
  related: Product[];
}

export interface Category {
  id?: string;
  _id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

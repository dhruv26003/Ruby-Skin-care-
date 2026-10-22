import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  size?: string;
  selectedSize?: string;
}

export interface CartSummary {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  total: number;
}

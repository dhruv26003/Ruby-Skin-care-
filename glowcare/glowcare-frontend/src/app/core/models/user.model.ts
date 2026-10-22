export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  addresses?: Address[];
  wishlist?: string[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

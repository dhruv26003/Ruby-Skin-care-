export interface Review {
  _id?: string;
  id?: string;
  product: string | { _id: string; name: string; images?: string[] };
  user?: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface CouponValidationResponse {
  success: boolean;
  message: string;
  coupon: {
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
  };
}

export interface ContactMessage {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status?: 'unread' | 'read' | 'replied';
  createdAt?: string;
}

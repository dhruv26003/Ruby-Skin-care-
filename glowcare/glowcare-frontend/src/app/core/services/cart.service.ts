import { Injectable, inject, signal, computed, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { CartItem } from '../models/cart.model';
import { CouponValidationResponse } from '../models/common.model';
import { ToastService } from './toast.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly toast = inject(ToastService);
  private readonly auth = inject(AuthService);
  private readonly apiUrl = 'http://localhost:5000/api';

  private readonly _items = signal<CartItem[]>([]);
  private readonly _coupon = signal<{
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    discountAmount: number;
  } | null>(null);

  public readonly items = this._items.asReadonly();
  public readonly coupon = this._coupon.asReadonly();

  public readonly itemCount = computed(() => {
    return this._items().reduce((sum, item) => sum + item.quantity, 0);
  });

  public readonly subtotal = computed(() => {
    return this._items().reduce((sum, item) => {
      const price = item.product.onSale && item.product.salePrice ? item.product.salePrice : item.product.price;
      return sum + price * item.quantity;
    }, 0);
  });

  public readonly discount = computed(() => {
    const c = this._coupon();
    if (!c) return 0;
    const sub = this.subtotal();
    if (c.discountType === 'percentage') {
      const disc = (sub * c.discountValue) / 100;
      return Math.round(disc * 100) / 100;
    }
    return Math.min(c.discountValue, sub);
  });

  public readonly shippingFee = computed(() => {
    const discountedSubtotal = this.subtotal() - this.discount();
    if (discountedSubtotal <= 0) return 0;
    return discountedSubtotal >= 999 ? 0 : 99.0;
  });

  public readonly total = computed(() => {
    const total = this.subtotal() - this.discount() + this.shippingFee();
    return Math.max(0, Math.round(total * 100) / 100);
  });

  private lastActiveUserId: string | null = null;

  constructor() {
    // Purge legacy un-scoped key
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem('rubycare_cart');
        localStorage.removeItem('rubycare_coupon');
        localStorage.removeItem('glowcare_cart');
        localStorage.removeItem('glowcare_coupon');
      } catch (e) {}
    }

    // Reactively load cart whenever user logs in, registers, or logs out
    effect(() => {
      const user = this.auth.currentUser();
      const currentUserId = user ? (user.id || user._id || user.email) : null;

      if (currentUserId !== this.lastActiveUserId) {
        this.lastActiveUserId = currentUserId;
        this.loadCart();
      }
    });
  }

  private getStorageKey(): string {
    const user = this.auth.currentUser();
    if (user && (user.id || user._id || user.email)) {
      return `rubycare_cart_${user.id || user._id || user.email}`;
    }
    return 'rubycare_cart_guest';
  }

  private loadCart(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const key = this.getStorageKey();
      const legacyKey = key.replace('rubycare_', 'glowcare_');
      const stored = localStorage.getItem(key) || localStorage.getItem(legacyKey);
      if (stored) {
        this._items.set(JSON.parse(stored));
      } else {
        this._items.set([]);
      }
      const storedCoupon = localStorage.getItem(`${key}_coupon`) || localStorage.getItem(`${legacyKey}_coupon`);
      if (storedCoupon) {
        this._coupon.set(JSON.parse(storedCoupon));
      } else {
        this._coupon.set(null);
      }
    } catch (e) {
      this._items.set([]);
      this._coupon.set(null);
    }
  }

  private saveCart(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const key = this.getStorageKey();
        localStorage.setItem(key, JSON.stringify(this._items()));
        if (this._coupon()) {
          localStorage.setItem(`${key}_coupon`, JSON.stringify(this._coupon()));
        } else {
          localStorage.removeItem(`${key}_coupon`);
        }
      } catch (e) {
        console.warn('Error writing cart to local storage', e);
      }
    }
  }

  public addToCart(product: Product, quantity: number = 1, size?: string): void {
    const pId = product.id || product._id;
    this._items.update((current) => {
      const existingIdx = current.findIndex(
        (i) => (i.product.id === pId || i.product._id === pId) && (!size || i.selectedSize === size)
      );

      if (existingIdx > -1) {
        const updated = [...current];
        updated[existingIdx] = {
          ...updated[existingIdx],
          quantity: updated[existingIdx].quantity + quantity
        };
        return updated;
      }

      return [
        ...current,
        {
          product,
          quantity,
          selectedSize: size || product.size
        }
      ];
    });

    this.saveCart();
    this.toast.success(`Added ${quantity} × "${product.name}" to your bag.`);
  }

  public updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    this._items.update((current) =>
      current.map((item) => {
        if (item.product.id === productId || item.product._id === productId) {
          return { ...item, quantity };
        }
        return item;
      })
    );

    this.saveCart();
  }

  public removeFromCart(productId: string): void {
    const item = this._items().find((i) => i.product.id === productId || i.product._id === productId);
    this._items.update((current) =>
      current.filter((i) => i.product.id !== productId && i.product._id !== productId)
    );
    this.saveCart();
    if (item) {
      this.toast.info(`Removed "${item.product.name}" from your bag.`);
    }
  }

  public clearCart(): void {
    this._items.set([]);
    this._coupon.set(null);
    if (isPlatformBrowser(this.platformId)) {
      try {
        const key = this.getStorageKey();
        localStorage.removeItem(key);
        localStorage.removeItem(`${key}_coupon`);
        localStorage.removeItem('rubycare_cart');
        localStorage.removeItem('rubycare_coupon');
        localStorage.removeItem('glowcare_cart');
        localStorage.removeItem('glowcare_coupon');
      } catch (e) {}
    }
  }

  public applyCoupon(code: string): Promise<boolean> {
    return new Promise((resolve) => {
      this.http
        .post<CouponValidationResponse>(`${this.apiUrl}/coupons/validate`, {
          code,
          orderSubtotal: this.subtotal()
        })
        .subscribe({
          next: (res) => {
            if (res.success && res.coupon) {
              this._coupon.set(res.coupon);
              this.saveCart();
              this.toast.success(`Promo code "${res.coupon.code}" applied! You saved ₹${res.coupon.discountAmount.toFixed(0)}.`);
              resolve(true);
            } else {
              this.toast.error(res.message || 'Invalid coupon.');
              resolve(false);
            }
          },
          error: (err) => {
            const msg = err.error?.message || 'Invalid or expired promo code.';
            this.toast.error(msg);
            resolve(false);
          }
        });
    });
  }

  public removeCoupon(): void {
    this._coupon.set(null);
    this.saveCart();
    this.toast.info('Promo code removed.');
  }
}

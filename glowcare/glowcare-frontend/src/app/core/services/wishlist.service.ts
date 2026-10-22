import { Injectable, inject, signal, computed, PLATFORM_ID, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Product } from '../models/product.model';
import { AuthService } from './auth.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly apiUrl = 'http://localhost:5000/api/wishlist';

  private readonly _items = signal<Product[]>([]);
  public readonly items = this._items.asReadonly();
  public readonly count = computed(() => this._items().length);

  private lastActiveUserId: string | null = null;

  constructor() {
    // Purge any legacy un-scoped wishlist keys
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem('rubycare_wishlist');
        localStorage.removeItem('glowcare_wishlist');
      } catch (e) {}
    }

    // Reactively watch user changes (login, logout, new customer registration)
    effect(() => {
      const user = this.auth.currentUser();
      const currentUserId = user ? (user.id || user._id || user.email) : null;

      // Detect user switch or login/logout
      if (currentUserId !== this.lastActiveUserId) {
        this.lastActiveUserId = currentUserId;

        if (currentUserId) {
          // Logged in as a specific user: Reset in-memory list first to prevent cross-user contamination
          this._items.set([]);
          this.fetchBackendWishlist();
        } else {
          // Logged out / Guest user
          this._items.set([]);
          if (isPlatformBrowser(this.platformId)) {
            this.loadGuestWishlist();
          }
        }
      }
    });
  }

  private getStorageKey(): string {
    const user = this.auth.currentUser();
    if (user && (user.id || user._id || user.email)) {
      return `rubycare_wishlist_${user.id || user._id || user.email}`;
    }
    return 'rubycare_wishlist_guest';
  }

  private loadGuestWishlist(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    try {
      const stored = localStorage.getItem('rubycare_wishlist_guest') || localStorage.getItem('glowcare_wishlist_guest');
      if (stored) {
        this._items.set(JSON.parse(stored));
      } else {
        this._items.set([]);
      }
    } catch (e) {
      this._items.set([]);
    }
  }

  private saveLocalWishlist(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const key = this.getStorageKey();
        localStorage.setItem(key, JSON.stringify(this._items()));
      } catch (e) {
        console.warn('Error writing wishlist to localStorage', e);
      }
    }
  }

  public isInWishlist(productId: string): boolean {
    return this._items().some((p) => p.id === productId || p._id === productId);
  }

  public toggleWishlist(product: Product): void {
    const pId = (product.id || product._id)!;
    const exists = this.isInWishlist(pId);

    if (exists) {
      this._items.update((current) =>
        current.filter((p) => p.id !== pId && p._id !== pId)
      );
      this.toast.info(`Removed "${product.name}" from your wishlist.`);
    } else {
      this._items.update((current) => [...current, product]);
      this.toast.success(`Saved "${product.name}" to your wishlist.`);
    }

    this.saveLocalWishlist();

    if (this.auth.isLoggedIn()) {
      this.http
        .post(`${this.apiUrl}/toggle`, { productId: pId }, { headers: this.auth.getAuthHeaders() })
        .subscribe({
          error: (err) => console.warn('Could not sync wishlist with database', err)
        });
    }
  }

  public fetchBackendWishlist(): void {
    if (!this.auth.isLoggedIn()) {
      this._items.set([]);
      return;
    }

    this.http
      .get<{ success: boolean; wishlist: Product[] }>(this.apiUrl, {
        headers: this.auth.getAuthHeaders()
      })
      .subscribe({
        next: (res) => {
          if (res.success && Array.isArray(res.wishlist)) {
            // Strictly set ONLY this authenticated user's wishlist from backend
            // For a brand new customer, res.wishlist is [] (empty)
            this._items.set(res.wishlist);
            this.saveLocalWishlist();
          } else {
            this._items.set([]);
          }
        },
        error: (err) => {
          console.warn('Error fetching user wishlist', err);
          this._items.set([]);
        }
      });
  }

  public clearWishlist(): void {
    this._items.set([]);
    if (isPlatformBrowser(this.platformId)) {
      try {
        localStorage.removeItem(this.getStorageKey());
        localStorage.removeItem('rubycare_wishlist');
        localStorage.removeItem('rubycare_wishlist_guest');
        localStorage.removeItem('glowcare_wishlist');
        localStorage.removeItem('glowcare_wishlist_guest');
      } catch (e) {}
    }
  }
}

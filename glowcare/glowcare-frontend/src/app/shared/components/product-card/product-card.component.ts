import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Product } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';
import { RatingStarsComponent } from '../rating-stars/rating-stars.component';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule, RatingStarsComponent],
  template: `
    <div class="product-card">
      <div class="card-image-wrap">
        <a [routerLink]="['/products', product.slug || product.id || product._id]">
          <img
            [src]="product.images[0]"
            [alt]="product.name"
            class="product-image"
            (error)="handleImageError($event)"
            loading="lazy"
          />
        </a>

        <!-- Badges -->
        <div class="badge-group">
          @if (product.onSale && product.salePrice) {
            <span class="badge badge-sale">
              {{ getDiscountPercent() }}% OFF
            </span>
          } @else if (product.isBestseller) {
            <span class="badge badge-bestseller">Bestseller</span>
          } @else if (product.isNewArrival) {
            <span class="badge badge-new">New</span>
          }
        </div>

        <!-- Wishlist Button -->
        <button
          type="button"
          class="wishlist-btn"
          [class.active]="isWishlisted()"
          (click)="toggleWishlist($event)"
          [attr.aria-label]="isWishlisted() ? 'Remove from wishlist' : 'Save to wishlist'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" [attr.fill]="isWishlisted() ? '#c94a4a' : 'none'" [attr.stroke]="isWishlisted() ? '#c94a4a' : 'currentColor'" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>

        <!-- Quick Add Overlay Button -->
        <div class="quick-add-wrap">
          <button type="button" class="btn btn-quick-add" (click)="addToBag($event)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Add to Bag
          </button>
        </div>
      </div>

      <div class="card-content">
        <div class="product-category">{{ product.category }}</div>
        <h3 class="product-title">
          <a [routerLink]="['/products', product.slug || product.id || product._id]">
            {{ product.name }}
          </a>
        </h3>

        <div class="rating-row">
          <app-rating-stars [rating]="product.rating" [reviewCount]="product.reviewCount"></app-rating-stars>
        </div>

        <div class="price-row">
          @if (product.onSale && product.salePrice) {
            <span class="sale-price">₹{{ product.salePrice.toFixed(0) }}</span>
            <span class="original-price">₹{{ product.price.toFixed(0) }}</span>
          } @else {
            <span class="regular-price">₹{{ product.price.toFixed(0) }}</span>
          }
          <span class="product-size">{{ product.size }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .product-card {
      background-color: var(--color-white, #fff);
      border-radius: var(--radius-md, 14px);
      overflow: hidden;
      border: 1px solid var(--color-border, #e8e2d8);
      transition: all var(--transition-normal, 0.3s cubic-bezier(0.16, 1, 0.3, 1));
      display: flex;
      flex-direction: column;
      position: relative;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 14px 35px rgba(28, 33, 30, 0.08);
        border-color: var(--color-accent-gold-light, #dfcbb0);

        .quick-add-wrap {
          opacity: 1;
          transform: translateY(0);
        }

        .product-image {
          transform: scale(1.05);
        }
      }
    }

    .card-image-wrap {
      position: relative;
      padding-top: 100%;
      background-color: var(--color-beige, #f4efe6);
      overflow: hidden;

      a {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }

    .product-image {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }

    .badge-group {
      position: absolute;
      top: 0.85rem;
      left: 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      z-index: 2;
    }

    .wishlist-btn {
      position: absolute;
      top: 0.85rem;
      right: 0.85rem;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full, 9999px);
      background-color: rgba(255, 255, 255, 0.9);
      backdrop-filter: blur(4px);
      border: 1px solid rgba(232, 226, 216, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--color-charcoal, #1c211e);
      transition: all 0.2s;
      z-index: 2;

      &:hover {
        background-color: var(--color-white, #fff);
        transform: scale(1.1);
      }

      &.active {
        color: #c94a4a;
      }
    }

    .quick-add-wrap {
      position: absolute;
      bottom: 0.85rem;
      left: 0.85rem;
      right: 0.85rem;
      opacity: 0;
      transform: translateY(10px);
      transition: all 0.25s ease;
      z-index: 2;
    }

    .btn-quick-add {
      width: 100%;
      background-color: rgba(28, 33, 30, 0.92);
      backdrop-filter: blur(8px);
      color: var(--color-white, #fff);
      font-size: 0.825rem;
      padding: 0.65rem 1rem;
      border-radius: var(--radius-full, 9999px);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.4rem;
      cursor: pointer;
      transition: background-color 0.2s;

      &:hover {
        background-color: var(--color-primary, #4e6b5d);
      }
    }

    .card-content {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .product-category {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-accent-gold, #c6a779);
      font-weight: 600;
      margin-bottom: 0.35rem;
    }

    .product-title {
      font-family: var(--font-sans);
      font-size: 0.95rem;
      font-weight: 600;
      line-height: 1.4;
      margin-bottom: 0.5rem;
      min-height: 2.7rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;

      a {
        color: var(--color-charcoal, #1c211e);
        &:hover {
          color: var(--color-primary, #4e6b5d);
        }
      }
    }

    .rating-row {
      margin-bottom: 0.75rem;
    }

    .price-row {
      margin-top: auto;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .regular-price, .sale-price {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-charcoal, #1c211e);
    }

    .sale-price {
      color: #a84242;
    }

    .original-price {
      font-size: 0.875rem;
      color: var(--color-muted-light, #949c97);
      text-decoration: line-through;
    }

    .product-size {
      margin-left: auto;
      font-size: 0.75rem;
      color: var(--color-muted, #646d68);
    }

    @media (max-width: 768px) {
      .quick-add-wrap {
        opacity: 1;
        transform: translateY(0);
        bottom: 0.5rem;
        left: 0.5rem;
        right: 0.5rem;
      }

      .btn-quick-add {
        font-size: 0.725rem;
        padding: 0.45rem 0.65rem;
      }

      .wishlist-btn {
        top: 0.5rem;
        right: 0.5rem;
        width: 32px;
        height: 32px;
        svg { width: 15px; height: 15px; }
      }

      .badge-group {
        top: 0.5rem;
        left: 0.5rem;
      }

      .card-content {
        padding: 0.75rem;

        .product-title {
          font-size: 0.9rem;
          margin-bottom: 0.35rem;
        }

        .regular-price, .sale-price {
          font-size: 0.95rem;
        }

        .original-price {
          font-size: 0.75rem;
        }

        .product-size {
          font-size: 0.68rem;
        }
      }
    }
  `]
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;

  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);

  public isWishlisted(): boolean {
    const id = (this.product.id || this.product._id)!;
    return this.wishlistService.isInWishlist(id);
  }

  public toggleWishlist(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
    this.wishlistService.toggleWishlist(this.product);
  }

  public addToBag(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
    this.cartService.addToCart(this.product, 1);
  }

  public getDiscountPercent(): number {
    if (!this.product.salePrice) return 0;
    return Math.round(((this.product.price - this.product.salePrice) / this.product.price) * 100);
  }

  public handleImageError(event: any): void {
    // Elegant fallback SVG
    event.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80';
  }
}

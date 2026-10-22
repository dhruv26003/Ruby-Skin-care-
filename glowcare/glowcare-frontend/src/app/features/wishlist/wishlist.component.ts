import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { CartService } from '../../core/services/cart.service';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { Product } from '../../core/models/product.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent],
  template: `
    <div class="wishlist-page">
      <section class="wishlist-hero">
        <div class="container">
          <span class="hero-sub">YOUR SAVED RITUALS</span>
          <h1>My Wishlist ({{ wishlistService.count() }})</h1>
          <p>Keep track of your favorite formulations and easily transfer them to your bag.</p>
        </div>
      </section>

      <div class="container section-padding">
        @if (wishlistService.items().length > 0) {
          <div class="wishlist-actions-bar">
            <span class="count-text">{{ wishlistService.count() }} Formulations Saved</span>
            <button class="btn btn-secondary btn-sm" (click)="moveAllToBag()">
              Move All To Bag
            </button>
          </div>

          <div class="grid-4">
            @for (product of wishlistService.items(); track product.id || product._id) {
              <div class="wishlist-card-wrapper">
                <app-product-card [product]="product"></app-product-card>
                <button
                  class="btn-remove-wishlist"
                  (click)="wishlistService.toggleWishlist(product)"
                  aria-label="Remove from wishlist"
                >
                  ✕ Remove
                </button>
              </div>
            }
          </div>
        } @else {
          <div class="empty-wishlist">
            <div class="empty-icon">🤍</div>
            <h2>Your Wishlist is Empty</h2>
            <p>Save your favorite serums, creams, and cleansers by tapping the heart icon while exploring.</p>
            <a routerLink="/products" class="btn btn-primary btn-lg">Explore Skincare</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .wishlist-hero {
      background: linear-gradient(180deg, var(--color-ivory, #faf7f2) 0%, var(--color-beige, #f4efe6) 100%);
      padding: 3rem 0;
      text-align: center;
      border-bottom: 1px solid var(--color-border, #e8e2d8);

      .hero-sub {
        font-size: 0.775rem;
        letter-spacing: 0.15em;
        font-weight: 700;
        color: var(--color-accent-gold, #c6a779);
        display: block;
        margin-bottom: 0.5rem;
      }
    }

    .wishlist-actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--color-border, #e8e2d8);

      .count-text {
        font-size: 0.9rem;
        color: var(--color-muted, #646d68);
        font-weight: 500;
      }
    }

    .wishlist-card-wrapper {
      display: flex;
      flex-direction: column;

      .btn-remove-wishlist {
        margin-top: 0.5rem;
        background: none;
        border: none;
        color: var(--color-muted, #646d68);
        font-size: 0.8rem;
        cursor: pointer;
        padding: 0.35rem;
        text-align: center;

        &:hover {
          color: var(--color-error, #c94a4a);
        }
      }
    }

    .empty-wishlist {
      text-align: center;
      padding: 5rem 1.5rem;
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);

      .empty-icon {
        font-size: 3.5rem;
        margin-bottom: 1rem;
      }

      h2 { margin-bottom: 0.75rem; }
      p { max-width: 480px; margin: 0 auto 2rem auto; }
    }

    @media (max-width: 600px) {
      .wishlist-hero {
        padding: 2rem 0;
      }

      .wishlist-actions-bar {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;

        .btn {
          width: 100%;
          text-align: center;
        }
      }
    }
  `]
})
export class WishlistComponent {
  public readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(CartService);

  public moveAllToBag(): void {
    const items = this.wishlistService.items();
    for (const item of items) {
      this.cartService.addToCart(item, 1);
    }
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="cart-page">
      <section class="cart-hero">
        <div class="container">
          <span class="cart-sub">YOUR BOTANICAL BAG</span>
          <h1>Shopping Cart</h1>
        </div>
      </section>

      <div class="container section-padding">
        @if (cartService.items().length > 0) {
          <!-- Free Shipping Threshold Progress Bar -->
          <div class="shipping-threshold-banner">
            @if (cartService.subtotal() >= 999) {
              <span class="threshold-success">🎉 Congratulations! You have unlocked <strong>Free Standard Shipping</strong>!</span>
            } @else {
              <span>
                Add <strong>₹{{ (999 - cartService.subtotal()).toFixed(0) }}</strong> more to unlock <strong>Free Delivery</strong>!
              </span>
            }
            <div class="threshold-bar-track">
              <div
                class="threshold-bar-fill"
                [style.width.%]="Math.min(100, (cartService.subtotal() / 999) * 100)"
              ></div>
            </div>
          </div>

          <div class="cart-layout-grid">
            <!-- Left: Cart Items List -->
            <div class="cart-items-panel">
              <div class="table-header">
                <span>Product</span>
                <span>Quantity</span>
                <span>Total</span>
              </div>

              <div class="items-list">
                @for (item of cartService.items(); track item.product.id || item.product._id) {
                  <div class="cart-item-row">
                    <!-- Image & Name -->
                    <div class="item-primary">
                      <a [routerLink]="['/products', item.product.slug || item.product.id || item.product._id]" class="item-img-link">
                        <img [src]="item.product.images[0]" [alt]="item.product.name" class="item-thumb" />
                      </a>
                      <div class="item-meta">
                        <span class="item-cat">{{ item.product.category }}</span>
                        <h3 class="item-name">
                          <a [routerLink]="['/products', item.product.slug || item.product.id || item.product._id]">
                            {{ item.product.name }}
                          </a>
                        </h3>
                        <span class="item-size">{{ item.size || item.product.size }}</span>
                        <div class="item-unit-price">
                          @if (item.product.onSale && item.product.salePrice) {
                            <span class="sale-unit">₹{{ item.product.salePrice.toFixed(0) }}</span>
                            <span class="orig-unit">₹{{ item.product.price.toFixed(0) }}</span>
                          } @else {
                            <span>₹{{ item.product.price.toFixed(0) }}</span>
                          }
                        </div>
                      </div>
                    </div>

                    <!-- Quantity Stepper -->
                    <div class="item-qty-wrap">
                      <div class="quantity-stepper">
                        <button
                          type="button"
                          (click)="cartService.updateQuantity((item.product.id || item.product._id)!, item.quantity - 1)"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span class="qty-display">{{ item.quantity }}</span>
                        <button
                          type="button"
                          (click)="cartService.updateQuantity((item.product.id || item.product._id)!, item.quantity + 1)"
                          [disabled]="item.quantity >= item.product.stock"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        class="btn-remove-item"
                        (click)="cartService.removeFromCart((item.product.id || item.product._id)!)"
                      >
                        Remove
                      </button>
                    </div>

                    <!-- Item Line Total -->
                    <div class="item-line-total">
                      ₹{{ getLinePrice(item).toFixed(0) }}
                    </div>
                  </div>
                }
              </div>

              <div class="cart-actions-row">
                <a routerLink="/products" class="btn btn-secondary btn-sm">
                  ← Continue Shopping
                </a>
                <button class="btn btn-outline btn-sm" (click)="cartService.clearCart()">
                  Clear Shopping Bag
                </button>
              </div>
            </div>

            <!-- Right: Order Summary Sidebar -->
            <div class="cart-summary-sidebar">
              <div class="summary-card">
                <h3>Order Summary</h3>

                <!-- Promo Code Box -->
                <div class="coupon-box">
                  <label class="coupon-label">Promotional Code</label>
                  @if (!cartService.coupon()) {
                    <div class="coupon-input-group">
                      <input
                        type="text"
                        [(ngModel)]="couponCodeInput"
                        placeholder="e.g., RUBY10"
                        class="coupon-input"
                      />
                      <button
                        type="button"
                        class="btn btn-secondary btn-sm"
                        (click)="applyCoupon()"
                        [disabled]="isApplyingCoupon || !couponCodeInput.trim()"
                      >
                        {{ isApplyingCoupon ? '...' : 'Apply' }}
                      </button>
                    </div>
                    <span class="coupon-hint">💡 Try code <strong>RUBY10</strong> (10% off) or <strong>WELCOME20</strong></span>
                  } @else {
                    <div class="applied-coupon-pill">
                      <span>✓ Code <strong>{{ cartService.coupon()!.code }}</strong> Applied</span>
                      <button (click)="cartService.removeCoupon()" class="remove-coupon-btn">✕</button>
                    </div>
                  }
                </div>

                <div class="summary-lines">
                  <div class="summary-line">
                    <span>Subtotal ({{ cartService.itemCount() }} items)</span>
                    <span>₹{{ cartService.subtotal().toFixed(0) }}</span>
                  </div>

                  @if (cartService.discount() > 0) {
                    <div class="summary-line discount-line">
                      <span>Promo Discount</span>
                      <span>-₹{{ cartService.discount().toFixed(0) }}</span>
                    </div>
                  }

                  <div class="summary-line">
                    <span>Estimated Shipping</span>
                    <span>
                      @if (cartService.shippingFee() === 0) {
                        <strong class="free-shipping-text">FREE</strong>
                      } @else {
                        ₹{{ cartService.shippingFee().toFixed(0) }}
                      }
                    </span>
                  </div>

                  <div class="summary-line total-line">
                    <span>Estimated Total</span>
                    <span>₹{{ cartService.total().toFixed(0) }}</span>
                  </div>
                </div>

                <a routerLink="/checkout" class="btn btn-primary btn-lg checkout-btn">
                  Proceed to Safe Checkout →
                </a>

                <div class="summary-badges">
                  <div class="sec-badge">
                    <span>🔒 Safe 256-Bit SSL Demo Checkout</span>
                  </div>
                  <div class="sec-badge">
                    <span>🌱 Carbon Neutral Delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        } @else {
          <!-- Empty Cart State -->
          <div class="empty-cart-wrap">
            <div class="empty-cart-icon">🛍️</div>
            <h2>Your Shopping Bag is Empty</h2>
            <p>Your daily ritual awaits. Explore our award-winning serums, cleansers, and botanical barrier treatments.</p>
            <a routerLink="/products" class="btn btn-primary btn-lg">
              Explore Our Collection
            </a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .cart-hero {
      background: linear-gradient(180deg, var(--color-ivory, #faf7f2) 0%, var(--color-beige, #f4efe6) 100%);
      padding: 3rem 0;
      text-align: center;
      border-bottom: 1px solid var(--color-border, #e8e2d8);

      .cart-sub {
        font-size: 0.775rem;
        letter-spacing: 0.15em;
        font-weight: 700;
        color: var(--color-accent-gold, #c6a779);
        display: block;
        margin-bottom: 0.5rem;
      }
    }

    .shipping-threshold-banner {
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      padding: 1.25rem 1.75rem;
      margin-bottom: 2.5rem;
      font-size: 0.9rem;
      text-align: center;

      .threshold-success {
        color: var(--color-success, #3c7d5c);
      }

      .threshold-bar-track {
        height: 6px;
        background: var(--color-beige, #f4efe6);
        border-radius: var(--radius-full, 9999px);
        margin-top: 0.75rem;
        overflow: hidden;

        .threshold-bar-fill {
          height: 100%;
          background: var(--color-primary, #4e6b5d);
          border-radius: var(--radius-full, 9999px);
          transition: width 0.4s ease;
        }
      }
    }

    .cart-layout-grid {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 3.5rem;
      align-items: start;
    }

    /* Items Table */
    .cart-items-panel {
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      padding: 2rem;

      .table-header {
        display: grid;
        grid-template-columns: 1fr 140px 100px;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--color-border, #e8e2d8);
        font-size: 0.775rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: var(--color-muted, #646d68);
      }
    }

    .items-list {
      display: flex;
      flex-direction: column;
    }

    .cart-item-row {
      display: grid;
      grid-template-columns: 1fr 140px 100px;
      align-items: center;
      padding: 1.75rem 0;
      border-bottom: 1px solid var(--color-border-subtle, #f0ebe2);

      &:last-child {
        border-bottom: none;
      }
    }

    .item-primary {
      display: flex;
      gap: 1.25rem;
      align-items: center;

      .item-img-link {
        width: 80px;
        height: 80px;
        border-radius: var(--radius-sm, 8px);
        overflow: hidden;
        flex-shrink: 0;
        background: var(--color-beige, #f4efe6);

        .item-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      .item-meta {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;

        .item-cat {
          font-size: 0.75rem;
          color: var(--color-accent-gold, #c6a779);
          text-transform: uppercase;
          font-weight: 600;
        }

        .item-name {
          font-size: 0.95rem;
          font-weight: 600;
          line-height: 1.3;

          a {
            color: var(--color-charcoal, #1c211e);
            &:hover { color: var(--color-primary, #4e6b5d); }
          }
        }

        .item-size {
          font-size: 0.75rem;
          color: var(--color-muted, #646d68);
        }

        .item-unit-price {
          font-size: 0.85rem;
          font-weight: 600;

          .sale-unit { color: #a84242; margin-right: 0.35rem; }
          .orig-unit { color: var(--color-muted-light, #949c97); text-decoration: line-through; }
        }
      }
    }

    .item-qty-wrap {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.4rem;

      .quantity-stepper {
        display: flex;
        align-items: center;
        background: var(--color-beige, #f4efe6);
        border: 1px solid var(--color-border, #e8e2d8);
        border-radius: var(--radius-full, 9999px);
        padding: 0.2rem 0.5rem;

        button {
          background: none;
          border: none;
          font-size: 1.1rem;
          width: 24px;
          height: 24px;
          cursor: pointer;
          color: var(--color-charcoal, #1c211e);
          display: flex;
          align-items: center;
          justify-content: center;

          &:disabled { opacity: 0.3; cursor: not-allowed; }
        }

        .qty-display {
          font-size: 0.875rem;
          font-weight: 600;
          min-width: 24px;
          text-align: center;
        }
      }

      .btn-remove-item {
        background: none;
        border: none;
        font-size: 0.75rem;
        color: var(--color-muted, #646d68);
        cursor: pointer;
        text-decoration: underline;

        &:hover { color: var(--color-error, #c94a4a); }
      }
    }

    .item-line-total {
      font-size: 1.1rem;
      font-weight: 700;
      color: var(--color-charcoal, #1c211e);
      text-align: right;
    }

    .cart-actions-row {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--color-border, #e8e2d8);
    }

    /* Summary Sidebar */
    .summary-card {
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      padding: 2rem;
      position: sticky;
      top: 90px;

      h3 { margin-bottom: 1.5rem; font-size: 1.35rem; }
    }

    .coupon-box {
      margin-bottom: 1.75rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--color-border-subtle, #f0ebe2);

      .coupon-label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--color-charcoal, #1c211e);
        display: block;
        margin-bottom: 0.4rem;
      }

      .coupon-input-group {
        display: flex;
        gap: 0.5rem;

        .coupon-input {
          flex: 1;
          padding: 0.55rem 0.85rem;
          border: 1px solid var(--color-border, #e8e2d8);
          border-radius: var(--radius-sm, 8px);
          font-size: 0.85rem;
          text-transform: uppercase;
          outline: none;

          &:focus { border-color: var(--color-primary, #4e6b5d); }
        }
      }

      .coupon-hint {
        font-size: 0.75rem;
        color: var(--color-muted, #646d68);
        display: block;
        margin-top: 0.35rem;
      }

      .applied-coupon-pill {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: var(--color-primary-soft, rgba(78, 107, 93, 0.1));
        padding: 0.5rem 0.85rem;
        border-radius: var(--radius-sm, 8px);
        font-size: 0.825rem;
        color: var(--color-primary, #4e6b5d);

        .remove-coupon-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-error, #c94a4a);
          font-size: 0.9rem;
        }
      }
    }

    .summary-lines {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      margin-bottom: 2rem;

      .summary-line {
        display: flex;
        justify-content: space-between;
        font-size: 0.925rem;
        color: var(--color-muted, #646d68);

        &.discount-line {
          color: #a84242;
          font-weight: 600;
        }

        .free-shipping-text {
          color: var(--color-success, #3c7d5c);
        }

        &.total-line {
          border-top: 1px solid var(--color-border, #e8e2d8);
          padding-top: 1rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-charcoal, #1c211e);
        }
      }
    }

    .checkout-btn {
      width: 100%;
      text-align: center;
    }

    .summary-badges {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.4rem;

      .sec-badge {
        font-size: 0.75rem;
        color: var(--color-muted, #646d68);
        text-align: center;
      }
    }

    /* Empty Cart */
    .empty-cart-wrap {
      text-align: center;
      padding: 5rem 1.5rem;
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);

      .empty-cart-icon {
        font-size: 3.5rem;
        margin-bottom: 1rem;
      }

      h2 { margin-bottom: 0.75rem; }
      p { max-width: 480px; margin: 0 auto 2rem auto; }
    }

    @media (max-width: 992px) {
      .cart-layout-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
    }

    @media (max-width: 600px) {
      .cart-items-panel .table-header { display: none; }
      .cart-item-row {
        grid-template-columns: 1fr;
        gap: 0.85rem;
        padding: 1.25rem 0;
      }
      .item-qty-wrap {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 100%;
      }
      .item-line-total {
        text-align: right;
        font-size: 1.15rem;
      }
      .cart-actions-row {
        flex-direction: column;
        gap: 0.75rem;
        .btn { width: 100%; text-align: center; }
      }
      .summary-card {
        padding: 1.5rem 1rem;
      }
    }
  `]
})
export class CartComponent {
  public readonly cartService = inject(CartService);
  public readonly Math = Math;

  public couponCodeInput: string = '';
  public isApplyingCoupon: boolean = false;

  public getLinePrice(item: any): number {
    const p = item.product.onSale && item.product.salePrice ? item.product.salePrice : item.product.price;
    return p * item.quantity;
  }

  public async applyCoupon(): Promise<void> {
    if (!this.couponCodeInput.trim()) return;
    this.isApplyingCoupon = true;
    await this.cartService.applyCoupon(this.couponCodeInput.trim());
    this.isApplyingCoupon = false;
    this.couponCodeInput = '';
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule],
  template: `
    <div class="checkout-page">
      <section class="checkout-hero">
        <div class="container">
          <span class="hero-sub">SAFE & CONSCIOUS SHOPPING</span>
          <h1>Checkout Ritual</h1>
        </div>
      </section>

      <div class="container section-padding">
        @if (cartService.items().length > 0) {
          <!-- Demo Mode Notice Box -->
          <div class="demo-checkout-notice">
            <span class="notice-icon">🛡️</span>
            <div class="notice-text">
              <strong>Academic Demonstration Safe Mode Enabled:</strong>
              No real credit card details or CVV numbers are required or stored. Orders are validated and processed on the RubyCare backend without live financial risk.
            </div>
          </div>

          <form [formGroup]="checkoutForm" (ngSubmit)="onSubmitOrder()" class="checkout-layout">
            <!-- Left Column: Forms -->
            <div class="checkout-forms">
              <!-- 1. Contact Information -->
              <div class="form-card">
                <div class="card-title-row">
                  <span class="step-num">1</span>
                  <h3>Contact Information</h3>
                </div>

                <div class="form-row">
                  <div class="form-group flex-1">
                    <label class="form-label" for="fullName">Full Name *</label>
                    <input
                      id="fullName"
                      type="text"
                      formControlName="fullName"
                      class="form-control"
                      placeholder="e.g. Jane Doe"
                    />
                    @if (f['fullName'].touched && f['fullName'].invalid) {
                      <span class="form-error">Please enter your full name.</span>
                    }
                  </div>

                  <div class="form-group flex-1">
                    <label class="form-label" for="email">Email Address *</label>
                    <input
                      id="email"
                      type="email"
                      formControlName="email"
                      class="form-control"
                      placeholder="jane.doe@example.com"
                    />
                    @if (f['email'].touched && f['email'].invalid) {
                      <span class="form-error">Please enter a valid email address.</span>
                    }
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="phone">Phone Number *</label>
                  <input
                    id="phone"
                    type="tel"
                    formControlName="phone"
                    class="form-control"
                    placeholder="+1 (555) 019-2834"
                  />
                  @if (f['phone'].touched && f['phone'].invalid) {
                    <span class="form-error">A contact phone number is required for shipping updates.</span>
                  }
                </div>
              </div>

              <!-- 2. Shipping Address -->
              <div class="form-card">
                <div class="card-title-row">
                  <span class="step-num">2</span>
                  <h3>Shipping Address</h3>
                </div>

                <div class="form-group">
                  <label class="form-label" for="street">Street Address *</label>
                  <input
                    id="street"
                    type="text"
                    formControlName="street"
                    class="form-control"
                    placeholder="124 Magnolia Blossom Lane, Apt 4B"
                  />
                  @if (f['street'].touched && f['street'].invalid) {
                    <span class="form-error">Please provide your complete street address.</span>
                  }
                </div>

                <div class="form-row">
                  <div class="form-group flex-1">
                    <label class="form-label" for="city">City *</label>
                    <input
                      id="city"
                      type="text"
                      formControlName="city"
                      class="form-control"
                      placeholder="Austin"
                    />
                    @if (f['city'].touched && f['city'].invalid) {
                      <span class="form-error">City is required.</span>
                    }
                  </div>

                  <div class="form-group flex-1">
                    <label class="form-label" for="state">State / Province *</label>
                    <input
                      id="state"
                      type="text"
                      formControlName="state"
                      class="form-control"
                      placeholder="TX"
                    />
                    @if (f['state'].touched && f['state'].invalid) {
                      <span class="form-error">State is required.</span>
                    }
                  </div>

                  <div class="form-group flex-1">
                    <label class="form-label" for="postalCode">Postal / ZIP Code *</label>
                    <input
                      id="postalCode"
                      type="text"
                      formControlName="postalCode"
                      class="form-control"
                      placeholder="78701"
                    />
                    @if (f['postalCode'].touched && f['postalCode'].invalid) {
                      <span class="form-error">Postal code is required.</span>
                    }
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="country">Country</label>
                  <input
                    id="country"
                    type="text"
                    formControlName="country"
                    class="form-control"
                    readonly
                  />
                </div>
              </div>

              <!-- 3. Safe Demo Payment Selection -->
              <div class="form-card">
                <div class="card-title-row">
                  <span class="step-num">3</span>
                  <h3>Payment Simulation</h3>
                </div>

                <div class="payment-options">
                  <label class="payment-method-card" [class.selected]="selectedPaymentMethod === 'demo_card'">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="demo_card"
                      [(ngModel)]="selectedPaymentMethod"
                      [ngModelOptions]="{standalone: true}"
                    />
                    <div class="pm-info">
                      <strong>Demo Card Simulator (Instant Authorization)</strong>
                      <p>Simulates verified PCI-DSS credit card approval. No real card required.</p>
                    </div>
                  </label>

                  <label class="payment-method-card" [class.selected]="selectedPaymentMethod === 'cod'">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      [(ngModel)]="selectedPaymentMethod"
                      [ngModelOptions]="{standalone: true}"
                    />
                    <div class="pm-info">
                      <strong>Cash On Delivery (Pay upon arrival)</strong>
                      <p>Settle when your botanical package arrives at your doorstep.</p>
                    </div>
                  </label>
                </div>

                <!-- Special Delivery Instructions -->
                <div class="form-group mt-3">
                  <label class="form-label" for="orderNotes">Delivery Instructions (Optional)</label>
                  <textarea
                    id="orderNotes"
                    formControlName="notes"
                    class="form-control"
                    placeholder="e.g., Leave package on front porch, door code #1234"
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Right Column: Order Summary Review -->
            <div class="checkout-summary-wrap">
              <div class="summary-card">
                <h3>Order Review</h3>

                <!-- Items Snapshot List -->
                <div class="summary-items-list">
                  @for (item of cartService.items(); track item.product.id || item.product._id) {
                    <div class="summary-item-row">
                      <div class="s-thumb-wrap">
                        <img [src]="item.product.images[0]" [alt]="item.product.name" class="s-thumb" />
                        <span class="s-qty-badge">{{ item.quantity }}</span>
                      </div>
                      <div class="s-item-info">
                        <span class="s-item-name">{{ item.product.name }}</span>
                        <span class="s-item-size">{{ item.size || item.product.size }}</span>
                      </div>
                      <span class="s-item-price">
                        ₹{{ getLinePrice(item).toFixed(0) }}
                      </span>
                    </div>
                  }
                </div>

                <!-- Price Calculations -->
                <div class="summary-calc-lines">
                  <div class="c-line">
                    <span>Subtotal</span>
                    <span>₹{{ cartService.subtotal().toFixed(0) }}</span>
                  </div>

                  @if (cartService.discount() > 0) {
                    <div class="c-line discount">
                      <span>Promo Discount ({{ cartService.coupon()?.code }})</span>
                      <span>-₹{{ cartService.discount().toFixed(0) }}</span>
                    </div>
                  }

                  <div class="c-line">
                    <span>Shipping Fee</span>
                    <span>
                      @if (cartService.shippingFee() === 0) {
                        <strong class="text-success">FREE</strong>
                      } @else {
                        ₹{{ cartService.shippingFee().toFixed(0) }}
                      }
                    </span>
                  </div>

                  <div class="c-line total">
                    <span>Total Amount</span>
                    <span class="total-amount">₹{{ cartService.total().toFixed(0) }}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  class="btn btn-primary btn-lg place-order-btn"
                  [disabled]="isPlacingOrder || checkoutForm.invalid"
                >
                  @if (isPlacingOrder) {
                    <span>Processing Order...</span>
                  } @else {
                    <span>Place Order • ₹{{ cartService.total().toFixed(0) }}</span>
                  }
                </button>

                <p class="safe-note">
                  🔒 By confirming your order, you agree to RubyCare's safe demonstration checkout conditions.
                </p>
              </div>
            </div>
          </form>
        } @else {
          <div class="empty-checkout">
            <h2>Your Bag Is Empty</h2>
            <p>Please select your skincare treatments before proceeding to checkout.</p>
            <a routerLink="/products" class="btn btn-primary">Return to Shop</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .checkout-hero {
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

    .demo-checkout-notice {
      display: flex;
      align-items: center;
      gap: 1rem;
      background: #e9f2ee;
      border: 1px solid #c2dbd0;
      border-radius: var(--radius-md, 14px);
      padding: 1.25rem 1.75rem;
      margin-bottom: 2.5rem;
      font-size: 0.875rem;
      color: var(--color-primary-dark, #2f4339);

      .notice-icon { font-size: 1.5rem; }
    }

    .checkout-layout {
      display: grid;
      grid-template-columns: 1fr 420px;
      gap: 3.5rem;
      align-items: start;
    }

    .checkout-forms {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .form-card {
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      padding: 2rem;

      .card-title-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1.5rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--color-border-subtle, #f0ebe2);

        .step-num {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: var(--color-primary, #4e6b5d);
          color: var(--color-white, #fff);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.825rem;
          font-weight: 700;
        }

        h3 { font-size: 1.25rem; }
      }
    }

    .form-row {
      display: flex;
      gap: 1.25rem;

      .flex-1 { flex: 1; }
    }

    .payment-options {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .payment-method-card {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      padding: 1.25rem;
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-sm, 8px);
      cursor: pointer;
      transition: all 0.2s;

      &.selected {
        border-color: var(--color-primary, #4e6b5d);
        background: var(--color-primary-soft, rgba(78, 107, 93, 0.05));
      }

      input[type="radio"] {
        margin-top: 0.25rem;
        accent-color: var(--color-primary, #4e6b5d);
      }

      .pm-info {
        strong { font-size: 0.95rem; color: var(--color-charcoal, #1c211e); display: block; margin-bottom: 0.2rem; }
        p { font-size: 0.8rem; color: var(--color-muted, #646d68); }
      }
    }

    /* Summary Card */
    .summary-card {
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      padding: 2rem;
      position: sticky;
      top: 90px;

      h3 { margin-bottom: 1.5rem; font-size: 1.35rem; }
    }

    .summary-items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--color-border, #e8e2d8);
      max-height: 280px;
      overflow-y: auto;
    }

    .summary-item-row {
      display: flex;
      align-items: center;
      gap: 1rem;

      .s-thumb-wrap {
        position: relative;
        width: 54px;
        height: 54px;
        border-radius: var(--radius-sm, 8px);
        background: var(--color-beige, #f4efe6);
        flex-shrink: 0;

        .s-thumb {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: var(--radius-sm, 8px);
        }

        .s-qty-badge {
          position: absolute;
          top: -6px;
          right: -6px;
          background: var(--color-primary, #4e6b5d);
          color: var(--color-white, #fff);
          font-size: 0.65rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }

      .s-item-info {
        flex: 1;
        display: flex;
        flex-direction: column;

        .s-item-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-charcoal, #1c211e);
          line-height: 1.3;
        }

        .s-item-size {
          font-size: 0.75rem;
          color: var(--color-muted, #646d68);
        }
      }

      .s-item-price {
        font-size: 0.9rem;
        font-weight: 700;
      }
    }

    .summary-calc-lines {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2rem;

      .c-line {
        display: flex;
        justify-content: space-between;
        font-size: 0.9rem;
        color: var(--color-muted, #646d68);

        &.discount { color: #a84242; font-weight: 600; }
        .text-success { color: var(--color-success, #3c7d5c); }

        &.total {
          border-top: 1px solid var(--color-border, #e8e2d8);
          padding-top: 1rem;
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--color-charcoal, #1c211e);
        }
      }
    }

    .place-order-btn {
      width: 100%;
      text-align: center;
    }

    .safe-note {
      font-size: 0.75rem;
      color: var(--color-muted, #646d68);
      text-align: center;
      margin-top: 1rem;
      line-height: 1.4;
    }

    .empty-checkout {
      text-align: center;
      padding: 4rem 1.5rem;
    }

    @media (max-width: 992px) {
      .checkout-layout {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
    }

    @media (max-width: 600px) {
      .checkout-hero {
        padding: 2rem 0;
      }
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      .form-card {
        padding: 1.25rem 1rem;
      }
      .order-summary-card {
        padding: 1.5rem 1rem;
      }
      .demo-checkout-notice {
        padding: 0.85rem 1rem;
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class CheckoutComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  public readonly cartService = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly authService = inject(AuthService);
  private readonly toast = inject(ToastService);
  private readonly router = inject(Router);

  public checkoutForm!: FormGroup;
  public selectedPaymentMethod: string = 'demo_card';
  public isPlacingOrder: boolean = false;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    const defaultAddress = user?.addresses?.[0];

    this.checkoutForm = this.fb.group({
      fullName: [user?.name || '', [Validators.required, Validators.minLength(2)]],
      email: [user?.email || '', [Validators.required, Validators.email]],
      phone: [user?.phone || '+91 98765 43210', [Validators.required]],
      street: [defaultAddress?.street || '42, Marine Drive, Nariman Point', [Validators.required]],
      city: [defaultAddress?.city || 'Mumbai', [Validators.required]],
      state: [defaultAddress?.state || 'Maharashtra', [Validators.required]],
      postalCode: [defaultAddress?.postalCode || '400021', [Validators.required]],
      country: [defaultAddress?.country || 'India'],
      notes: ['']
    });
  }

  get f() {
    return this.checkoutForm.controls;
  }

  public getLinePrice(item: any): number {
    const p = item.product.onSale && item.product.salePrice ? item.product.salePrice : item.product.price;
    return p * item.quantity;
  }

  public onSubmitOrder(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.toast.error('Please complete all required shipping fields.');
      return;
    }

    this.isPlacingOrder = true;
    const formVals = this.checkoutForm.value;

    const itemsPayload = this.cartService.items().map((item) => ({
      productId: (item.product.id || item.product._id)!,
      quantity: item.quantity
    }));

    const orderPayload = {
      items: itemsPayload,
      shippingAddress: {
        fullName: formVals.fullName,
        email: formVals.email,
        phone: formVals.phone,
        street: formVals.street,
        city: formVals.city,
        state: formVals.state,
        postalCode: formVals.postalCode,
        country: formVals.country || 'United States'
      },
      couponCode: this.cartService.coupon()?.code,
      paymentMethod: this.selectedPaymentMethod === 'demo_card' ? 'Demo Card Simulator' : 'Cash On Delivery',
      notes: formVals.notes
    };

    this.orderService.placeOrder(orderPayload).subscribe({
      next: (res) => {
        this.toast.success('Your order was placed successfully!');
        this.cartService.clearCart();
        this.isPlacingOrder = false;
        this.router.navigate(['/order-confirmation', res.order.orderNumber]);
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error processing your order. Please try again.');
        this.isPlacingOrder = false;
      }
    });
  }
}

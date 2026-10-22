import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { OrderService } from '../../core/services/order.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="confirmation-page">
      <div class="container section-padding">
        @if (isLoading()) {
          <div class="loading-state">
            <p>Retrieving your order confirmation details...</p>
          </div>
        } @else if (order()) {
          <div class="confirmation-card">
            <!-- Success Header -->
            <div class="success-banner">
              <div class="check-circle">✓</div>
              <span class="conf-sub">ORDER CONFIRMED</span>
              <h1>Thank You for Your Order!</h1>
              <p class="order-subtext">
                Your botanical skincare package is now being gently prepared in our clean facility. A confirmation receipt has been generated.
              </p>
              <div class="order-number-badge">
                <span>Order Reference: <strong>{{ order()!.orderNumber }}</strong></span>
              </div>
            </div>

            <!-- Estimated Dispatch -->
            <div class="delivery-estimate-bar">
              <div class="est-item">
                <span class="est-icon">📦</span>
                <div>
                  <strong>Estimated Dispatch</strong>
                  <p>Within 24 business hours</p>
                </div>
              </div>
              <div class="est-item">
                <span class="est-icon">🚚</span>
                <div>
                  <strong>Estimated Delivery</strong>
                  <p>2 - 4 business days</p>
                </div>
              </div>
              <div class="est-item">
                <span class="est-icon">💳</span>
                <div>
                  <strong>Payment Status</strong>
                  <p class="text-success">Verified ({{ order()!.paymentMethod }})</p>
                </div>
              </div>
            </div>

            <!-- Order Details Grid -->
            <div class="order-info-grid">
              <!-- Left: Items Breakdown -->
              <div class="items-summary-col">
                <h3>Ordered Formulations</h3>
                <div class="items-list">
                  @for (item of order()!.items; track item.name) {
                    <div class="order-item-row">
                      <img [src]="item.image" [alt]="item.name" class="item-img" />
                      <div class="item-details">
                        <h4>{{ item.name }}</h4>
                        <span class="item-size">{{ item.size || 'Standard Size' }} • Qty: {{ item.quantity }}</span>
                      </div>
                      <span class="item-price">₹{{ (item.price * item.quantity).toFixed(0) }}</span>
                    </div>
                  }
                </div>
              </div>

              <!-- Right: Address & Totals -->
              <div class="shipping-summary-col">
                <h3>Delivery Address</h3>
                <div class="address-box">
                  <strong>{{ order()!.shippingAddress.fullName }}</strong>
                  <p>{{ order()!.shippingAddress.street }}</p>
                  <p>{{ order()!.shippingAddress.city }}, {{ order()!.shippingAddress.state }} {{ order()!.shippingAddress.postalCode }}</p>
                  <p>{{ order()!.shippingAddress.country }}</p>
                  <p class="mt-2">Phone: {{ order()!.shippingAddress.phone }}</p>
                </div>

                <h3 class="mt-4">Payment Summary</h3>
                <div class="pricing-box">
                  <div class="p-line">
                    <span>Subtotal:</span>
                    <span>₹{{ order()!.subtotal.toFixed(0) }}</span>
                  </div>
                  @if (order()!.discount > 0) {
                    <div class="p-line discount">
                      <span>Discount ({{ order()!.couponCode }}):</span>
                      <span>-₹{{ order()!.discount.toFixed(0) }}</span>
                    </div>
                  }
                  <div class="p-line">
                    <span>Shipping:</span>
                    <span>
                      @if (order()!.shippingFee === 0) {
                        <strong class="text-success">FREE</strong>
                      } @else {
                        ₹{{ order()!.shippingFee.toFixed(0) }}
                      }
                    </span>
                  </div>
                  <div class="p-line grand-total">
                    <span>Total Paid:</span>
                    <span>₹{{ order()!.total.toFixed(0) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer Actions -->
            <div class="confirmation-actions">
              <a routerLink="/products" class="btn btn-primary btn-lg">Continue Shopping</a>
              <a routerLink="/profile" [queryParams]="{tab: 'orders'}" class="btn btn-secondary btn-lg">View in My Orders</a>
            </div>
          </div>
        } @else {
          <div class="not-found-state">
            <h2>Order Not Found</h2>
            <p>We could not locate this order reference. Please check your order history.</p>
            <a routerLink="/products" class="btn btn-primary">Return to Shop</a>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .confirmation-page {
      background-color: var(--color-ivory, #faf7f2);
      min-height: 80vh;
    }

    .confirmation-card {
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-xl, 30px);
      padding: clamp(2rem, 5vw, 4rem);
      max-width: 900px;
      margin: 0 auto;
      box-shadow: 0 15px 40px rgba(28, 33, 30, 0.06);
    }

    .success-banner {
      text-align: center;
      margin-bottom: 2.5rem;

      .check-circle {
        width: 64px;
        height: 64px;
        border-radius: 50%;
        background-color: var(--color-primary-soft, rgba(78, 107, 93, 0.1));
        color: var(--color-primary, #4e6b5d);
        font-size: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1.25rem auto;
      }

      .conf-sub {
        font-size: 0.8rem;
        font-weight: 700;
        letter-spacing: 0.15em;
        color: var(--color-accent-gold, #c6a779);
        display: block;
        margin-bottom: 0.4rem;
      }

      h1 { margin-bottom: 0.75rem; font-size: clamp(1.8rem, 3.5vw, 2.5rem); }
      .order-subtext { max-width: 580px; margin: 0 auto 1.5rem auto; font-size: 1rem; }

      .order-number-badge {
        display: inline-block;
        padding: 0.6rem 1.5rem;
        background: var(--color-beige, #f4efe6);
        border: 1px dashed var(--color-border, #e8e2d8);
        border-radius: var(--radius-full, 9999px);
        font-size: 0.95rem;
        color: var(--color-charcoal, #1c211e);
      }
    }

    .delivery-estimate-bar {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      background: var(--color-beige, #f4efe6);
      border-radius: var(--radius-md, 14px);
      padding: 1.5rem;
      margin-bottom: 3rem;

      .est-item {
        display: flex;
        align-items: center;
        gap: 0.85rem;

        .est-icon { font-size: 1.6rem; }
        strong { font-size: 0.875rem; color: var(--color-charcoal, #1c211e); display: block; }
        p { font-size: 0.8rem; margin: 0; }
        .text-success { color: var(--color-success, #3c7d5c); font-weight: 600; }
      }
    }

    .order-info-grid {
      display: grid;
      grid-template-columns: 1.2fr 0.8fr;
      gap: 3rem;
      margin-bottom: 3rem;

      h3 { font-size: 1.2rem; margin-bottom: 1.25rem; }
    }

    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;

      .order-item-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--color-border-subtle, #f0ebe2);

        .item-img {
          width: 60px;
          height: 60px;
          border-radius: var(--radius-sm, 8px);
          object-fit: cover;
          background: var(--color-beige, #f4efe6);
        }

        .item-details {
          flex: 1;
          h4 { font-family: var(--font-sans); font-size: 0.9rem; font-weight: 600; margin-bottom: 0.2rem; }
          .item-size { font-size: 0.775rem; color: var(--color-muted, #646d68); }
        }

        .item-price { font-weight: 700; font-size: 0.95rem; }
      }
    }

    .address-box, .pricing-box {
      background: var(--color-ivory, #faf7f2);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-sm, 8px);
      padding: 1.25rem;
      font-size: 0.875rem;

      p { margin: 0; line-height: 1.5; color: var(--color-charcoal, #1c211e); }
      .mt-2 { margin-top: 0.5rem; }
    }

    .pricing-box {
      display: flex;
      flex-direction: column;
      gap: 0.6rem;

      .p-line {
        display: flex;
        justify-content: space-between;
        color: var(--color-muted, #646d68);

        &.discount { color: #a84242; }
        .text-success { color: var(--color-success, #3c7d5c); }

        &.grand-total {
          border-top: 1px solid var(--color-border, #e8e2d8);
          padding-top: 0.75rem;
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--color-charcoal, #1c211e);
        }
      }
    }

    .confirmation-actions {
      display: flex;
      justify-content: center;
      gap: 1.25rem;
      padding-top: 2rem;
      border-top: 1px solid var(--color-border, #e8e2d8);
      flex-wrap: wrap;
    }

    @media (max-width: 768px) {
      .delivery-estimate-bar { grid-template-columns: 1fr; gap: 1rem; }
      .order-info-grid { grid-template-columns: 1fr; gap: 2rem; }
    }
  `]
})
export class OrderConfirmationComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly orderService = inject(OrderService);

  public readonly order = signal<Order | null>(null);
  public readonly isLoading = signal<boolean>(true);

  ngOnInit(): void {
    const orderNumber = this.route.snapshot.paramMap.get('orderNumber');
    if (orderNumber) {
      this.orderService.getOrderById(orderNumber).subscribe({
        next: (res) => {
          this.order.set(res.order);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        }
      });
    } else {
      this.isLoading.set(false);
    }
  }
}

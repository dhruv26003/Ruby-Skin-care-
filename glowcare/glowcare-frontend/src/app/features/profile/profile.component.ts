import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { OrderService } from '../../core/services/order.service';
import { ToastService } from '../../core/services/toast.service';
import { Order } from '../../core/models/order.model';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="profile-page">
      <section class="profile-hero">
        <div class="container">
          <span class="hero-sub">CLIENT PORTAL</span>
          <h1>My Ritual Account</h1>
          <p>Manage your delivery details, view past botanical orders, and track active dispatches.</p>
        </div>
      </section>

      <div class="container section-padding">
        @if (authService.currentUser(); as user) {
          <div class="profile-layout">
            <!-- Left Sidebar Navigation -->
            <aside class="profile-sidebar">
              <div class="user-card-header">
                <div class="avatar-circle">
                  {{ user.name.charAt(0).toUpperCase() }}
                </div>
                <h3>{{ user.name }}</h3>
                <span class="user-email">{{ user.email }}</span>
                <span class="role-pill">{{ user.role | uppercase }}</span>
              </div>

              <div class="sidebar-menu">
                <button
                  class="menu-btn"
                  [class.active]="activeTab() === 'orders'"
                  (click)="setTab('orders')"
                >
                  <span class="menu-icon">📦</span>
                  <span>My Orders ({{ orders().length }})</span>
                </button>
                <button
                  class="menu-btn"
                  [class.active]="activeTab() === 'details'"
                  (click)="setTab('details')"
                >
                  <span class="menu-icon">👤</span>
                  <span>Account Details</span>
                </button>
                <a routerLink="/wishlist" class="menu-btn link-btn">
                  <span class="menu-icon">🤍</span>
                  <span>Saved Wishlist</span>
                </a>
                @if (authService.isAdmin()) {
                  <a routerLink="/admin" class="menu-btn admin-menu-btn">
                    <span class="menu-icon">⚙️</span>
                    <span>Admin Dashboard</span>
                  </a>
                }
                <button class="menu-btn logout-menu-btn" (click)="logout()">
                  <span class="menu-icon">🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </aside>

            <!-- Right Main Content Panel -->
            <main class="profile-main-panel">
              <!-- TAB 1: ORDERS -->
              @if (activeTab() === 'orders') {
                <div class="panel-card">
                  <div class="panel-header">
                    <h2>Order History</h2>
                    <span class="order-count-badge">{{ orders().length }} Completed Orders</span>
                  </div>

                  @if (isLoadingOrders()) {
                    <div class="loading-state">Loading your order history...</div>
                  } @else if (orders().length > 0) {
                    <div class="orders-list">
                      @for (order of orders(); track order._id || order.id || order.orderNumber) {
                        <div class="order-card">
                          <div class="order-top-bar">
                            <div>
                              <span class="order-id-label">Order Reference:</span>
                              <strong class="order-id">{{ order.orderNumber }}</strong>
                              <span class="order-date">• {{ order.createdAt | date:'mediumDate' }}</span>
                            </div>
                            <span class="badge badge-status" [ngClass]="order.orderStatus.toLowerCase()">
                              {{ order.orderStatus }}
                            </span>
                          </div>

                          <div class="order-items-grid">
                            @for (item of order.items; track item.name) {
                              <div class="o-item">
                                <img [src]="item.image" [alt]="item.name" class="o-thumb" />
                                <div class="o-meta">
                                  <h4>{{ item.name }}</h4>
                                  <span>Qty: {{ item.quantity }} • ₹{{ item.price.toFixed(0) }}</span>
                                </div>
                              </div>
                            }
                          </div>

                          <div class="order-bottom-bar">
                            <div class="delivery-status">
                              @if (order.trackingNumber) {
                                <span>Tracking: <code>{{ order.trackingNumber }}</code></span>
                              } @else {
                                <span>Standard Eco-Friendly Delivery</span>
                              }
                            </div>
                            <div class="order-total-sum">
                              <span>Total:</span>
                              <strong>₹{{ order.total.toFixed(0) }}</strong>
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  } @else {
                    <div class="empty-orders">
                      <p>You haven't placed any skincare orders yet.</p>
                      <a routerLink="/products" class="btn btn-primary btn-sm">Explore Collection</a>
                    </div>
                  }
                </div>
              }

              <!-- TAB 2: ACCOUNT DETAILS -->
              @if (activeTab() === 'details') {
                <div class="panel-card">
                  <div class="panel-header">
                    <h2>Account Information</h2>
                  </div>

                  <form (submit)="onSaveProfile($event)" class="profile-edit-form">
                    <div class="form-row">
                      <div class="form-group flex-1">
                        <label class="form-label">Full Name</label>
                        <input
                          type="text"
                          [(ngModel)]="editName"
                          name="editName"
                          class="form-control"
                          required
                        />
                      </div>
                      <div class="form-group flex-1">
                        <label class="form-label">Email Address (Read-only)</label>
                        <input
                          type="email"
                          [value]="user.email"
                          class="form-control"
                          readonly
                          disabled
                        />
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Contact Phone</label>
                      <input
                        type="tel"
                        [(ngModel)]="editPhone"
                        name="editPhone"
                        class="form-control"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <h3 class="mt-4 mb-3">Primary Delivery Address</h3>
                    <div class="form-group">
                      <label class="form-label">Street Address</label>
                      <input
                        type="text"
                        [(ngModel)]="editStreet"
                        name="editStreet"
                        class="form-control"
                        placeholder="42, Marine Drive, Nariman Point"
                      />
                    </div>

                    <div class="form-row">
                      <div class="form-group flex-1">
                        <label class="form-label">City</label>
                        <input
                          type="text"
                          [(ngModel)]="editCity"
                          name="editCity"
                          class="form-control"
                          placeholder="Mumbai"
                        />
                      </div>
                      <div class="form-group flex-1">
                        <label class="form-label">State</label>
                        <input
                          type="text"
                          [(ngModel)]="editState"
                          name="editState"
                          class="form-control"
                          placeholder="Maharashtra"
                        />
                      </div>
                      <div class="form-group flex-1">
                        <label class="form-label">Postal Code</label>
                        <input
                          type="text"
                          [(ngModel)]="editPostal"
                          name="editPostal"
                          class="form-control"
                          placeholder="400021"
                        />
                      </div>
                    </div>

                    <button type="submit" class="btn btn-primary mt-3" [disabled]="isSavingProfile">
                      {{ isSavingProfile ? 'Saving Changes...' : 'Save Profile Details' }}
                    </button>
                  </form>
                </div>
              }
            </main>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .profile-hero {
      background: linear-gradient(180deg, var(--color-ivory, #faf7f2) 0%, var(--color-beige, #f4efe6) 100%);
      padding: 3.5rem 0;
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

      h1 { margin-bottom: 0.75rem; }
      p { max-width: 600px; margin: 0 auto; font-size: 1.05rem; }
    }

    .profile-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 3rem;
      align-items: start;
    }

    .profile-sidebar {
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      padding: 2rem 1.5rem;

      .user-card-header {
        text-align: center;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid var(--color-border-subtle, #f0ebe2);
        margin-bottom: 1.5rem;

        .avatar-circle {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: var(--color-primary, #4e6b5d);
          color: var(--color-white, #fff);
          font-size: 1.75rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem auto;
        }

        h3 { font-size: 1.15rem; margin-bottom: 0.2rem; }
        .user-email { font-size: 0.825rem; color: var(--color-muted, #646d68); display: block; margin-bottom: 0.5rem; }

        .role-pill {
          display: inline-block;
          font-size: 0.65rem;
          font-weight: 700;
          padding: 0.2rem 0.6rem;
          border-radius: var(--radius-full, 9999px);
          background: var(--color-primary-soft, rgba(78, 107, 93, 0.1));
          color: var(--color-primary, #4e6b5d);
        }
      }

      .sidebar-menu {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;

        .menu-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-sm, 8px);
          background: none;
          border: none;
          text-align: left;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-charcoal, #1c211e);
          cursor: pointer;
          transition: all 0.15s;

          &:hover {
            background: var(--color-beige, #f4efe6);
            color: var(--color-primary, #4e6b5d);
          }

          &.active {
            background: var(--color-primary, #4e6b5d);
            color: var(--color-white, #fff);
          }

          &.admin-menu-btn {
            color: var(--color-primary, #4e6b5d);
            font-weight: 600;
          }

          &.logout-menu-btn {
            color: var(--color-error, #c94a4a);
            margin-top: 0.5rem;
            border-top: 1px solid var(--color-border-subtle, #f0ebe2);
            padding-top: 1rem;
          }
        }
      }
    }

    .panel-card {
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      padding: 2.5rem;

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--color-border-subtle, #f0ebe2);

        h2 { font-size: 1.5rem; }
        .order-count-badge { font-size: 0.85rem; color: var(--color-muted, #646d68); }
      }
    }

    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .order-card {
        border: 1px solid var(--color-border, #e8e2d8);
        border-radius: var(--radius-md, 14px);
        padding: 1.5rem;

        .order-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-border-subtle, #f0ebe2);
          margin-bottom: 1.25rem;

          .order-id-label { font-size: 0.8rem; color: var(--color-muted, #646d68); margin-right: 0.35rem; }
          .order-id { font-size: 0.95rem; color: var(--color-charcoal, #1c211e); }
          .order-date { font-size: 0.8rem; color: var(--color-muted, #646d68); margin-left: 0.5rem; }
        }

        .order-items-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1rem;
          margin-bottom: 1.25rem;

          .o-item {
            display: flex;
            align-items: center;
            gap: 0.75rem;

            .o-thumb {
              width: 48px;
              height: 48px;
              border-radius: var(--radius-xs, 4px);
              object-fit: cover;
              background: var(--color-beige, #f4efe6);
            }

            .o-meta {
              h4 { font-family: var(--font-sans); font-size: 0.85rem; font-weight: 600; line-height: 1.2; }
              span { font-size: 0.75rem; color: var(--color-muted, #646d68); }
            }
          }
        }

        .order-bottom-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border-subtle, #f0ebe2);
          font-size: 0.85rem;

          code {
            background: var(--color-beige, #f4efe6);
            padding: 0.2rem 0.4rem;
            border-radius: var(--radius-xs, 4px);
          }

          .order-total-sum {
            font-size: 1.1rem;
            strong { color: var(--color-primary, #4e6b5d); margin-left: 0.35rem; }
          }
        }
      }
    }

    .form-row {
      display: flex;
      gap: 1.25rem;
      .flex-1 { flex: 1; }
    }

    .empty-orders {
      text-align: center;
      padding: 3rem 1.5rem;
      p { margin-bottom: 1.25rem; }
    }

    @media (max-width: 992px) {
      .profile-layout { grid-template-columns: 1fr; }
    }

    @media (max-width: 600px) {
      .profile-sidebar, .panel-card {
        padding: 1.5rem 1rem;
      }

      .panel-card .panel-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .form-row {
        flex-direction: column;
        gap: 0;
      }

      .orders-list .order-card {
        padding: 1rem;

        .order-top-bar {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.35rem;

          .order-date {
            margin-left: 0;
          }
        }

        .order-bottom-bar {
          flex-direction: column;
          align-items: flex-start;
          gap: 0.75rem;

          .order-total-sum {
            width: 100%;
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  public readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public readonly orders = signal<Order[]>([]);
  public readonly isLoadingOrders = signal<boolean>(true);
  public readonly activeTab = signal<'orders' | 'details'>('orders');

  public editName: string = '';
  public editPhone: string = '';
  public editStreet: string = '';
  public editCity: string = '';
  public editState: string = '';
  public editPostal: string = '';
  public isSavingProfile: boolean = false;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.editName = user.name || '';
      this.editPhone = user.phone || '';
      const addr = user.addresses?.[0];
      if (addr) {
        this.editStreet = addr.street || '';
        this.editCity = addr.city || '';
        this.editState = addr.state || '';
        this.editPostal = addr.postalCode || '';
      }
    }

    this.route.queryParams.subscribe((params) => {
      if (params['tab'] === 'details') {
        this.activeTab.set('details');
      } else {
        this.activeTab.set('orders');
      }
    });

    this.loadOrders();
  }

  public setTab(tab: 'orders' | 'details'): void {
    this.activeTab.set(tab);
  }

  private loadOrders(): void {
    this.isLoadingOrders.set(true);
    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        this.orders.set(res.orders);
        this.isLoadingOrders.set(false);
      },
      error: () => {
        this.isLoadingOrders.set(false);
      }
    });
  }

  public onSaveProfile(e: Event): void {
    e.preventDefault();
    this.isSavingProfile = true;

    const payload: Partial<User> = {
      name: this.editName,
      phone: this.editPhone,
      addresses: [
        {
          street: this.editStreet,
          city: this.editCity,
          state: this.editState,
          postalCode: this.editPostal,
          country: 'United States',
          isDefault: true
        }
      ]
    };

    this.authService.updateProfile(payload).subscribe({
      next: () => {
        this.isSavingProfile = false;
      },
      error: () => {
        this.isSavingProfile = false;
      }
    });
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { ProductService } from '../../core/services/product.service';
import { ContactService, ReviewService } from '../../core/services/review-contact.service';
import { ToastService } from '../../core/services/toast.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../core/models/product.model';
import { Order } from '../../core/models/order.model';
import { ContactMessage, Review } from '../../core/models/common.model';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="admin-shell">
      <!-- Mobile Backdrop Overlay -->
      @if (isMobileSidebarOpen()) {
        <div class="mobile-overlay" (click)="isMobileSidebarOpen.set(false)"></div>
      }

      <!-- 1. LEFT SIDEBAR -->
      <aside class="admin-sidebar" [class.open]="isMobileSidebarOpen()">
        <!-- Brand / Header -->
        <div class="sidebar-brand">
          <div class="brand-info">
            <span class="brand-icon">🌿</span>
            <div class="brand-text">
              <span class="brand-name">RUBYCARE</span>
              <span class="brand-badge">ADMIN</span>
            </div>
          </div>
          <button class="mobile-close-btn" (click)="isMobileSidebarOpen.set(false)" aria-label="Close menu">✕</button>
        </div>

        <!-- Navigation Section -->
        <div class="sidebar-nav-wrap">
          <span class="nav-section-label">CORE MANAGEMENT</span>
          <nav class="sidebar-nav">
            <button
              class="nav-item"
              [class.active]="activeTab() === 'orders'"
              (click)="selectTab('orders')"
            >
              <span class="nav-icon">📦</span>
              <span class="nav-label">Orders</span>
              <span class="nav-badge">{{ orders().length }}</span>
            </button>

            <button
              class="nav-item"
              [class.active]="activeTab() === 'products'"
              (click)="selectTab('products')"
            >
              <span class="nav-icon">🌿</span>
              <span class="nav-label">Product Catalog</span>
              <span class="nav-badge">{{ products().length }}</span>
            </button>

            <button
              class="nav-item"
              [class.active]="activeTab() === 'admins'"
              (click)="selectTab('admins')"
            >
              <span class="nav-icon">🛡️</span>
              <span class="nav-label">Administrators</span>
              <span class="nav-badge">{{ admins().length }}</span>
            </button>

            <button
              class="nav-item"
              [class.active]="activeTab() === 'messages'"
              (click)="selectTab('messages')"
            >
              <span class="nav-icon">💬</span>
              <span class="nav-label">Client Inquiries</span>
              <span class="nav-badge" [class.badge-alert]="unreadMessagesCount() > 0">
                {{ messages().length }}
              </span>
            </button>

            <button
              class="nav-item"
              [class.active]="activeTab() === 'reviews'"
              (click)="selectTab('reviews')"
            >
              <span class="nav-icon">⭐</span>
              <span class="nav-label">Reviews</span>
              <span class="nav-badge">{{ reviews().length }}</span>
            </button>
          </nav>

          <span class="nav-section-label store-section-label">STORE ACCESS</span>
          <a routerLink="/" class="nav-item nav-link-external" target="_blank" rel="noopener">
            <span class="nav-icon">🏪</span>
            <span class="nav-label">View Public Store</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="arrow-ext">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>

        <!-- Sidebar Footer: Admin Profile & Logout -->
        <div class="sidebar-footer">
          <div class="admin-user-card">
            <div class="user-avatar">
              <span>AD</span>
              <span class="live-dot"></span>
            </div>
            <div class="user-details">
              <strong class="user-name">RubyCare Admin</strong>
              <small class="user-role">Super Admin</small>
            </div>
          </div>
          <button (click)="logout()" class="btn-sidebar-logout" title="Sign Out">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <!-- 2. RIGHT MAIN CONTENT PANEL -->
      <main class="admin-main">
        <!-- Compact Top Header Bar -->
        <header class="admin-header-bar">
          <div class="header-left">
            <button class="mobile-toggle-btn" (click)="isMobileSidebarOpen.set(true)" aria-label="Open menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div class="breadcrumb-wrap">
              <span class="bc-root">Admin Console</span>
              <span class="bc-sep">/</span>
              <h1 class="bc-current">{{ currentTabTitle() }}</h1>
            </div>
          </div>

          <div class="header-right">
            <!-- Search bar -->
            <div class="admin-search-box">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                [(ngModel)]="searchFilter"
                placeholder="Search {{ activeTab() }}..."
                class="admin-search-input"
              />
              @if (searchFilter) {
                <button class="clear-search-btn" (click)="searchFilter = ''">✕</button>
              }
            </div>

            <!-- Tab Action Button -->
            @if (activeTab() === 'products') {
              <button class="btn btn-primary btn-sm" (click)="openCreateProductModal()">
                + Add Formulation
              </button>
            }

            <!-- Server Status -->
            <div class="system-chip">
              <span class="pulse-dot"></span>
              <span class="chip-text">Live Node API</span>
            </div>
          </div>
        </header>

        <!-- Compact KPI Metric Strip (High Space Efficiency) -->
        <section class="admin-kpi-strip">
          <div class="kpi-chip">
            <span class="kpi-icon">💰</span>
            <div class="kpi-details">
              <span class="kpi-label">Verified Sales</span>
              <strong class="kpi-val sales-val">
                <span class="cur-symbol">₹</span>{{ (stats().totalSales || 0).toLocaleString('en-IN') }}
              </strong>
            </div>
          </div>

          <div class="kpi-chip">
            <span class="kpi-icon">📦</span>
            <div class="kpi-details">
              <span class="kpi-label">Total Orders</span>
              <strong class="kpi-val">{{ stats().totalOrders || 0 }}</strong>
            </div>
          </div>

          <div class="kpi-chip">
            <span class="kpi-icon">🌿</span>
            <div class="kpi-details">
              <span class="kpi-label">Formulations</span>
              <strong class="kpi-val">{{ stats().totalProducts || 0 }}</strong>
            </div>
          </div>

          <div class="kpi-chip">
            <span class="kpi-icon">👥</span>
            <div class="kpi-details">
              <span class="kpi-label">Customers</span>
              <strong class="kpi-val">{{ stats().totalCustomers || 0 }}</strong>
            </div>
          </div>
        </section>

        <!-- Main Data Content View -->
        <div class="admin-content-view">
          <!-- ================= TAB: ORDERS ================= -->
          @if (activeTab() === 'orders') {
            <div class="data-card">
              <div class="data-card-header">
                <div>
                  <h2 class="card-title">Recent Customer Orders</h2>
                  <span class="card-subtitle">Manage customer shipments and update dispatch status</span>
                </div>
                <span class="count-pill">{{ filteredOrders().length }} orders</span>
              </div>

              <div class="table-responsive">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Order #</th>
                      <th>Customer</th>
                      <th>Date</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Dispatch Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (order of filteredOrders(); track order._id || order.id || order.orderNumber) {
                      <tr>
                        <td><strong class="order-num">{{ order.orderNumber }}</strong></td>
                        <td>
                          <div class="cust-info">
                            <span class="cust-name">{{ order.shippingAddress.fullName }}</span>
                            <small class="cust-email">{{ order.shippingAddress.email }}</small>
                          </div>
                        </td>
                        <td>{{ order.createdAt | date: 'dd MMM yyyy' }}</td>
                        <td>
                          <span class="items-count-tag">{{ order.items.length }} formulations</span>
                        </td>
                        <td>
                          <strong class="order-price">₹{{ order.total.toFixed(0) }}</strong>
                        </td>
                        <td>
                          <select
                            [ngModel]="order.orderStatus"
                            (ngModelChange)="onUpdateOrderStatus(order, $event)"
                            class="status-select"
                            [ngClass]="order.orderStatus.toLowerCase()"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <button class="btn-view-details" (click)="viewOrderDetails(order)">
                            Details
                          </button>
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="7" class="empty-table-cell">
                          <p>No orders found matching "{{ searchFilter }}".</p>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- ================= TAB: PRODUCTS ================= -->
          @if (activeTab() === 'products') {
            <div class="data-card">
              <div class="data-card-header">
                <div>
                  <h2 class="card-title">Product Inventory Management</h2>
                  <span class="card-subtitle">Live catalog pricing, formulation sizes & stock tracking</span>
                </div>
                <button class="btn btn-primary btn-sm" (click)="openCreateProductModal()">
                  + Add Formulation
                </button>
              </div>

              <!-- Inline Product Add/Edit Drawer -->
              @if (isProductModalOpen()) {
                <div class="product-form-box">
                  <div class="form-box-header">
                    <h3>{{ editingProduct() ? 'Edit Product' : 'Create New Formulation' }}</h3>
                    <button class="close-box-btn" (click)="isProductModalOpen.set(false)">✕</button>
                  </div>
                  <form (submit)="onSaveProduct($event)" class="prod-form">
                    <div class="form-row">
                      <div class="form-group flex-1">
                        <label class="form-label">Product Name *</label>
                        <input type="text" [(ngModel)]="prodForm.name" name="name" class="form-control" required />
                      </div>
                      <div class="form-group flex-1">
                        <label class="form-label">Category *</label>
                        <select [(ngModel)]="prodForm.category" name="category" class="form-control" required>
                          <option value="Cleansers">Cleansers</option>
                          <option value="Toners & Essences">Toners & Essences</option>
                          <option value="Serums & Ampoules">Serums & Ampoules</option>
                          <option value="Moisturizers & Creams">Moisturizers & Creams</option>
                          <option value="Sun Protection">Sun Protection</option>
                          <option value="Face Masks">Face Masks</option>
                          <option value="Lip Care">Lip Care</option>
                        </select>
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group flex-1">
                        <label class="form-label">Price (₹) *</label>
                        <input type="number" step="1" [(ngModel)]="prodForm.price" name="price" class="form-control" required />
                      </div>
                      <div class="form-group flex-1">
                        <label class="form-label">Sale Price (₹)</label>
                        <input type="number" step="1" [(ngModel)]="prodForm.salePrice" name="salePrice" class="form-control" />
                      </div>
                      <div class="form-group flex-1">
                        <label class="form-label">Stock Quantity *</label>
                        <input type="number" [(ngModel)]="prodForm.stock" name="stock" class="form-control" required />
                      </div>
                      <div class="form-group flex-1">
                        <label class="form-label">Size</label>
                        <input type="text" [(ngModel)]="prodForm.size" name="size" class="form-control" placeholder="50 ml" />
                      </div>
                    </div>

                    <div class="form-group">
                      <label class="form-label">Image URL *</label>
                      <input type="url" [(ngModel)]="prodForm.imageUrl" name="imageUrl" class="form-control" required />
                    </div>

                    <div class="form-group">
                      <label class="form-label">Description *</label>
                      <textarea [(ngModel)]="prodForm.description" name="description" class="form-control" rows="3" required></textarea>
                    </div>

                    <div class="form-actions-row">
                      <button type="submit" class="btn btn-primary btn-sm">Save Formulation</button>
                      <button type="button" class="btn btn-secondary btn-sm" (click)="isProductModalOpen.set(false)">Cancel</button>
                    </div>
                  </form>
                </div>
              }

              <div class="table-responsive">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Badge</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (prod of filteredProducts(); track prod.id || prod._id) {
                      <tr>
                        <td>
                          <img [src]="prod.images[0]" [alt]="prod.name" class="table-thumb" />
                        </td>
                        <td>
                          <strong class="prod-table-name">{{ prod.name }}</strong>
                          <small class="prod-table-size">{{ prod.size }}</small>
                        </td>
                        <td>
                          <span class="category-chip">{{ prod.category }}</span>
                        </td>
                        <td>
                          @if (prod.onSale && prod.salePrice) {
                            <span class="sale-price">₹{{ prod.salePrice.toFixed(0) }}</span>
                            <small class="orig-price">₹{{ prod.price.toFixed(0) }}</small>
                          } @else {
                            <strong>₹{{ prod.price.toFixed(0) }}</strong>
                          }
                        </td>
                        <td>
                          <span [class.stock-low]="prod.stock <= 10" class="stock-pill">
                            {{ prod.stock }} units
                          </span>
                        </td>
                        <td>
                          @if (prod.isBestseller) { <span class="badge badge-bestseller">Bestseller</span> }
                          @else if (prod.isNewArrival) { <span class="badge badge-new">New</span> }
                          @else { <span class="badge-plain">Standard</span> }
                        </td>
                        <td>
                          <div class="table-actions">
                            <button class="btn-table-edit" (click)="openEditProductModal(prod)" title="Edit">Edit</button>
                            <button class="btn-table-del" (click)="onDeleteProduct(prod)" title="Delete">Delete</button>
                          </div>
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="7" class="empty-table-cell">
                          <p>No formulations found matching "{{ searchFilter }}".</p>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- ================= TAB: INQUIRIES ================= -->
          @if (activeTab() === 'messages') {
            <div class="data-card">
              <div class="data-card-header">
                <div>
                  <h2 class="card-title">Customer Inquiries & Messages</h2>
                  <span class="card-subtitle">Live contact form submissions from clients</span>
                </div>
                <span class="count-pill">{{ filteredMessages().length }} messages</span>
              </div>

              <div class="table-responsive">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Sender</th>
                      <th>Subject</th>
                      <th>Message</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (msg of filteredMessages(); track msg._id || msg.id) {
                      <tr>
                        <td>{{ msg.createdAt | date: 'dd MMM yyyy' }}</td>
                        <td>
                          <div class="cust-info">
                            <strong>{{ msg.name }}</strong>
                            <small class="cust-email">{{ msg.email }}</small>
                          </div>
                        </td>
                        <td><strong class="msg-sub">{{ msg.subject }}</strong></td>
                        <td class="msg-col">{{ msg.message }}</td>
                        <td>
                          <span class="badge" [class.badge-new]="msg.status === 'unread'">
                            {{ msg.status | uppercase }}
                          </span>
                        </td>
                        <td>
                          @if (msg.status === 'unread') {
                            <button class="btn-action" (click)="markMessageRead(msg)">Mark Read</button>
                          } @else {
                            <span class="text-reviewed">Reviewed</span>
                          }
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="6" class="empty-table-cell">
                          <p>No messages found matching "{{ searchFilter }}".</p>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- ================= TAB: REVIEWS ================= -->
          @if (activeTab() === 'reviews') {
            <div class="data-card">
              <div class="data-card-header">
                <div>
                  <h2 class="card-title">Customer Reviews Moderation</h2>
                  <span class="card-subtitle">Verified customer reviews and botanical formulation ratings</span>
                </div>
                <span class="count-pill">{{ filteredReviews().length }} reviews</span>
              </div>

              <div class="table-responsive">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Reviewer</th>
                      <th>Rating</th>
                      <th>Title & Comment</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (rev of filteredReviews(); track rev._id || rev.id) {
                      <tr>
                        <td>{{ rev.createdAt | date: 'dd MMM yyyy' }}</td>
                        <td><strong>{{ rev.userName }}</strong></td>
                        <td>
                          <span class="star-rating">{{ rev.rating }} / 5 ★</span>
                        </td>
                        <td>
                          <strong class="rev-title">{{ rev.title }}</strong>
                          <p class="rev-snippet">{{ rev.comment }}</p>
                        </td>
                        <td>
                          <span class="badge" [class.badge-new]="rev.status === 'approved'">
                            {{ rev.status | uppercase }}
                          </span>
                        </td>
                        <td>
                          <button class="btn-table-del" (click)="deleteReview(rev)">Remove</button>
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="6" class="empty-table-cell">
                          <p>No reviews found matching "{{ searchFilter }}".</p>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }

          <!-- ================= TAB: ADMINISTRATORS ================= -->
          @if (activeTab() === 'admins') {
            <div class="data-card">
              <div class="data-card-header">
                <div>
                  <h2 class="card-title">Administrator Management</h2>
                  <span class="card-subtitle">Manage administrative privileges, team members & store operators</span>
                </div>
                <button class="btn btn-primary btn-sm" (click)="openCreateAdminModal()">
                  + Create New Admin
                </button>
              </div>

              <!-- Inline Admin Creation Drawer / Modal -->
              @if (isAdminModalOpen()) {
                <div class="product-form-box">
                  <div class="form-box-header">
                    <h3>Create New Administrator Account</h3>
                    <button class="close-box-btn" (click)="isAdminModalOpen.set(false)">✕</button>
                  </div>
                  <form (submit)="onCreateAdmin($event)" class="prod-form">
                    <div class="form-row">
                      <div class="form-group flex-1">
                        <label class="form-label">Full Name *</label>
                        <input type="text" [(ngModel)]="adminForm.name" name="adminName" class="form-control" placeholder="e.g. Priya Sharma" required />
                      </div>
                      <div class="form-group flex-1">
                        <label class="form-label">Email Address *</label>
                        <input type="email" [(ngModel)]="adminForm.email" name="adminEmail" class="form-control" placeholder="e.g. priya@rubycare.com" required />
                      </div>
                    </div>

                    <div class="form-row">
                      <div class="form-group flex-1">
                        <label class="form-label">Password * (Min 6 chars)</label>
                        <input type="password" [(ngModel)]="adminForm.password" name="adminPassword" class="form-control" placeholder="••••••••" required minlength="6" />
                      </div>
                      <div class="form-group flex-1">
                        <label class="form-label">Phone Number (Optional)</label>
                        <input type="text" [(ngModel)]="adminForm.phone" name="adminPhone" class="form-control" placeholder="+91 98765 43210" />
                      </div>
                    </div>

                    <div class="form-actions-row">
                      <button type="submit" class="btn btn-primary btn-sm" [disabled]="isSubmittingAdmin">
                        {{ isSubmittingAdmin ? 'Creating Account...' : 'Create Admin Account' }}
                      </button>
                      <button type="button" class="btn btn-secondary btn-sm" (click)="isAdminModalOpen.set(false)">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              }

              <!-- Administrators Table -->
              <div class="table-responsive">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Administrator</th>
                      <th>Email</th>
                      <th>Role & Access</th>
                      <th>Phone</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (adm of filteredAdmins(); track adm._id || adm.id) {
                      <tr>
                        <td>
                          <div class="cust-info">
                            <div class="user-avatar-small">
                              <span>{{ adm.name.substring(0, 2) | uppercase }}</span>
                            </div>
                            <div>
                              <strong>{{ adm.name }}</strong>
                              @if (adm.email === 'admin@rubycare.com') {
                                <span class="primary-badge">Primary Root</span>
                              }
                            </div>
                          </div>
                        </td>
                        <td>{{ adm.email }}</td>
                        <td>
                          <span class="badge badge-bestseller">ADMINISTRATOR</span>
                        </td>
                        <td>{{ adm.phone || '—' }}</td>
                        <td>{{ adm.createdAt | date: 'dd MMM yyyy' }}</td>
                        <td>
                          @if (adm.email !== 'admin@rubycare.com') {
                            <button class="btn-table-del" (click)="onDeleteAdmin(adm)" title="Remove Admin Access">
                              Delete
                            </button>
                          } @else {
                            <span class="text-reviewed" title="System default administrator cannot be removed">Protected</span>
                          }
                        </td>
                      </tr>
                    } @empty {
                      <tr>
                        <td colspan="6" class="empty-table-cell">
                          <p>No administrators found matching "{{ searchFilter }}".</p>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          }
        </div>
      </main>

      <!-- 3. ORDER DETAILS POPUP MODAL -->
      @if (selectedOrder()) {
        <div class="modal-backdrop" (click)="selectedOrder.set(null)">
          <div class="order-modal-card" (click)="$event.stopPropagation()">
            <div class="modal-header">
              <div>
                <span class="modal-sub">ORDER REFERENCE</span>
                <h3>{{ selectedOrder()!.orderNumber }}</h3>
              </div>
              <button class="modal-close" (click)="selectedOrder.set(null)">✕</button>
            </div>

            <div class="modal-body">
              <div class="modal-grid-2">
                <div class="modal-box">
                  <span class="box-label">Recipient & Delivery</span>
                  <strong>{{ selectedOrder()!.shippingAddress.fullName }}</strong>
                  <p>{{ selectedOrder()!.shippingAddress.street }}</p>
                  <p>{{ selectedOrder()!.shippingAddress.city }}, {{ selectedOrder()!.shippingAddress.postalCode }}</p>
                  <p>Phone: {{ selectedOrder()!.shippingAddress.phone }}</p>
                </div>

                <div class="modal-box">
                  <span class="box-label">Payment & Dispatch</span>
                  <p>Method: <strong>{{ selectedOrder()!.paymentMethod | uppercase }}</strong></p>
                  <p>Date: {{ selectedOrder()!.createdAt | date: 'medium' }}</p>
                  <p>Status: <span class="badge">{{ selectedOrder()!.orderStatus }}</span></p>
                  <p>Grand Total: <strong class="text-primary-dark">₹{{ selectedOrder()!.total.toFixed(0) }}</strong></p>
                </div>
              </div>

              <div class="modal-items-list">
                <span class="box-label">Formulations in Package ({{ selectedOrder()!.items.length }})</span>
                @for (item of selectedOrder()!.items; track item.name) {
                  <div class="order-item-row">
                    <img [src]="item.image" [alt]="item.name" class="modal-item-thumb" />
                    <div class="modal-item-info">
                      <strong>{{ item.name }}</strong>
                      <small>Qty: {{ item.quantity }} × ₹{{ item.price }}</small>
                    </div>
                    <strong class="item-subtotal">₹{{ (item.quantity * item.price).toFixed(0) }}</strong>
                  </div>
                }
              </div>
            </div>

            <div class="modal-footer">
              <button class="btn btn-secondary btn-sm" (click)="selectedOrder.set(null)">Close</button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    /* ==========================================================================
       SIDEBAR-BASED ENTERPRISE ADMIN DASHBOARD
       Ultra space-efficient, sticky navigation, compact KPI strip
       ========================================================================== */

    :host {
      display: block;
      width: 100%;
      height: 100vh;
      overflow: hidden;
    }

    .admin-shell {
      display: flex;
      width: 100%;
      height: 100vh;
      background: #fbf9f6;
      font-family: var(--font-sans, 'Plus Jakarta Sans', system-ui, sans-serif);
      color: #1c211e;
      overflow: hidden;
    }

    /* --------------------------------------------------------------------------
       1. LEFT SIDEBAR STYLING
       -------------------------------------------------------------------------- */
    .admin-sidebar {
      width: 250px;
      min-width: 250px;
      background: #14211a;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      z-index: 100;
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .sidebar-brand {
      padding: 1.25rem 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .brand-info {
        display: flex;
        align-items: center;
        gap: 0.65rem;
      }

      .brand-icon {
        font-size: 1.4rem;
      }

      .brand-text {
        display: flex;
        align-items: center;
        gap: 0.45rem;
      }

      .brand-name {
        font-size: 1.05rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: #ffffff;
      }

      .brand-badge {
        font-size: 0.625rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        background: rgba(198, 167, 121, 0.22);
        color: #dfcbb0;
        padding: 0.15rem 0.4rem;
        border-radius: 4px;
        border: 1px solid rgba(198, 167, 121, 0.35);
      }

      .mobile-close-btn {
        display: none;
        background: none;
        border: none;
        color: #ffffff;
        font-size: 1.2rem;
        cursor: pointer;
      }
    }

    .sidebar-nav-wrap {
      flex: 1;
      padding: 1.25rem 0.85rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;

      .nav-section-label {
        font-size: 0.65rem;
        font-weight: 700;
        letter-spacing: 0.1em;
        color: rgba(255, 255, 255, 0.4);
        padding: 0.5rem 0.65rem 0.25rem;
      }

      .store-section-label {
        margin-top: 1.5rem;
      }
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.75);
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;
      text-decoration: none;

      .nav-icon {
        font-size: 1.05rem;
        display: flex;
        align-items: center;
      }

      .nav-label {
        flex: 1;
      }

      .nav-badge {
        font-size: 0.7rem;
        font-weight: 700;
        background: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.85);
        padding: 0.15rem 0.5rem;
        border-radius: 9999px;

        &.badge-alert {
          background: #ef4444;
          color: #ffffff;
        }
      }

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: #ffffff;
      }

      &.active {
        background: #4e6b5d;
        color: #ffffff;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);

        .nav-badge {
          background: rgba(255, 255, 255, 0.25);
          color: #ffffff;
        }
      }
    }

    .nav-link-external {
      color: rgba(255, 255, 255, 0.65);
      border: 1px dashed rgba(255, 255, 255, 0.15);
      margin-top: 0.25rem;

      &:hover {
        background: rgba(255, 255, 255, 0.06);
        color: #dfcbb0;
        border-color: rgba(198, 167, 121, 0.4);
      }

      .arrow-ext {
        color: rgba(255, 255, 255, 0.4);
      }
    }

    .sidebar-footer {
      padding: 1rem 0.85rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(0, 0, 0, 0.15);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      .admin-user-card {
        display: flex;
        align-items: center;
        gap: 0.65rem;
      }

      .user-avatar {
        width: 34px;
        height: 34px;
        border-radius: 50%;
        background: #2a3d33;
        color: #dfcbb0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: 700;
        position: relative;

        .live-dot {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 8px;
          height: 8px;
          background: #22c55e;
          border-radius: 50%;
          border: 1.5px solid #14211a;
        }
      }

      .user-details {
        display: flex;
        flex-direction: column;
        line-height: 1.2;

        .user-name {
          font-size: 0.8rem;
          color: #ffffff;
        }

        .user-role {
          font-size: 0.675rem;
          color: rgba(255, 255, 255, 0.5);
        }
      }

      .btn-sidebar-logout {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.45rem;
        width: 100%;
        padding: 0.45rem;
        border-radius: 6px;
        background: rgba(248, 113, 113, 0.1);
        border: 1px solid rgba(248, 113, 113, 0.2);
        color: #fca5a5;
        font-size: 0.775rem;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;

        &:hover {
          background: rgba(248, 113, 113, 0.2);
          color: #ffffff;
        }
      }
    }

    /* --------------------------------------------------------------------------
       2. RIGHT MAIN CONTENT PANEL
       -------------------------------------------------------------------------- */
    .admin-main {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      height: 100vh;
      overflow-y: auto;
    }

    /* Header Topbar */
    .admin-header-bar {
      height: 56px;
      min-height: 56px;
      background: #ffffff;
      border-bottom: 1px solid #e8e2d8;
      padding: 0 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: sticky;
      top: 0;
      z-index: 50;

      .header-left {
        display: flex;
        align-items: center;
        gap: 0.85rem;
      }

      .mobile-toggle-btn {
        display: none;
        background: none;
        border: none;
        color: #1c211e;
        cursor: pointer;
      }

      .breadcrumb-wrap {
        display: flex;
        align-items: baseline;
        gap: 0.4rem;

        .bc-root {
          font-size: 0.8rem;
          color: #646d68;
        }

        .bc-sep {
          color: #b0b8b3;
          font-size: 0.8rem;
        }

        .bc-current {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1c211e;
          margin: 0;
        }
      }

      .header-right {
        display: flex;
        align-items: center;
        gap: 0.85rem;
      }

      .admin-search-box {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        background: #f4efe6;
        border: 1px solid #e8e2d8;
        border-radius: 20px;
        padding: 0.3rem 0.75rem;
        color: #646d68;

        .admin-search-input {
          border: none;
          background: transparent;
          font-size: 0.8rem;
          color: #1c211e;
          outline: none;
          width: 170px;
          font-family: inherit;
        }

        .clear-search-btn {
          background: none;
          border: none;
          font-size: 0.75rem;
          cursor: pointer;
          color: #646d68;
        }
      }

      .system-chip {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.75rem;
        color: #2b332f;
        background: rgba(78, 107, 93, 0.08);
        padding: 0.3rem 0.65rem;
        border-radius: 9999px;
        border: 1px solid rgba(78, 107, 93, 0.15);

        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #16a34a;
          box-shadow: 0 0 5px rgba(22, 163, 74, 0.5);
        }
      }
    }

    /* Compact KPI Strip */
    .admin-kpi-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
      padding: 1rem 1.5rem;
      background: #faf7f2;
      border-bottom: 1px solid #ede7dc;

      .kpi-chip {
        background: #ffffff;
        border: 1px solid #e8e2d8;
        border-radius: 10px;
        padding: 0.65rem 0.85rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        box-shadow: 0 1px 3px rgba(28, 33, 30, 0.03);

        .kpi-icon {
          font-size: 1.35rem;
          background: #f4efe6;
          width: 38px;
          height: 38px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .kpi-details {
          display: flex;
          flex-direction: column;
          line-height: 1.15;
        }

        .kpi-label {
          font-size: 0.68rem;
          font-weight: 600;
          color: #646d68;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .kpi-val {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1c211e;

          &.sales-val {
            display: flex;
            align-items: baseline;
            gap: 0.1rem;

            .cur-symbol {
              font-size: 1rem;
              color: #4e6b5d;
              font-weight: 600;
            }
          }
        }
      }
    }

    /* Main Content View (Table Card) */
    .admin-content-view {
      flex: 1;
      padding: 1.25rem 1.5rem;
      overflow-y: auto;
    }

    .data-card {
      background: #ffffff;
      border: 1px solid #e8e2d8;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(28, 33, 30, 0.04);
      padding: 1.25rem;

      .data-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        padding-bottom: 0.85rem;
        border-bottom: 1px solid #f0ebe2;
        flex-wrap: wrap;
        gap: 0.5rem;

        .card-title {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1c211e;
          margin: 0 0 0.15rem 0;
        }

        .card-subtitle {
          font-size: 0.775rem;
          color: #646d68;
        }

        .count-pill {
          font-size: 0.75rem;
          font-weight: 600;
          background: #f4efe6;
          color: #4e6b5d;
          padding: 0.25rem 0.65rem;
          border-radius: 9999px;
          border: 1px solid #e8e2d8;
        }
      }
    }

    /* --------------------------------------------------------------------------
       TABLE STYLING
       -------------------------------------------------------------------------- */
    .table-responsive {
      overflow-x: auto;
      max-height: calc(100vh - 260px);
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.835rem;

      thead th {
        position: sticky;
        top: 0;
        z-index: 10;
        text-align: left;
        padding: 0.7rem 0.85rem;
        font-size: 0.72rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: #4e6b5d;
        background: #f7f3ec;
        border-bottom: 1px solid #e8e2d8;
        white-space: nowrap;
      }

      tbody td {
        padding: 0.75rem 0.85rem;
        border-bottom: 1px solid #f0ebe2;
        vertical-align: middle;
      }

      tbody tr:hover {
        background-color: #faf8f5;
      }
    }

    .order-num {
      color: #1c211e;
      font-weight: 700;
      font-size: 0.85rem;
    }

    .cust-info {
      display: flex;
      flex-direction: column;
      line-height: 1.25;

      .cust-name {
        font-weight: 600;
        color: #1c211e;
      }

      .cust-email {
        color: #646d68;
        font-size: 0.725rem;
      }
    }

    .items-count-tag {
      display: inline-block;
      font-size: 0.75rem;
      color: #646d68;
      background: #f4efe6;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }

    .order-price {
      font-size: 0.88rem;
      color: #1c211e;
    }

    .status-select {
      padding: 0.25rem 0.55rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      border: 1px solid #e8e2d8;
      outline: none;
      cursor: pointer;

      &.pending { background: #fff3cd; color: #856404; }
      &.processing { background: #d1ecf1; color: #0c5460; }
      &.shipped { background: #d4edda; color: #155724; }
      &.delivered { background: #e2f0d9; color: #2e6930; }
      &.cancelled { background: #f8d7da; color: #721c24; }
    }

    .btn-view-details {
      padding: 0.3rem 0.65rem;
      font-size: 0.75rem;
      font-weight: 600;
      background: #f4efe6;
      border: 1px solid #e8e2d8;
      border-radius: 5px;
      color: #1c211e;
      cursor: pointer;
      transition: all 0.15s;

      &:hover {
        background: #4e6b5d;
        color: #ffffff;
        border-color: #4e6b5d;
      }
    }

    /* Products View */
    .table-thumb {
      width: 40px;
      height: 40px;
      border-radius: 6px;
      object-fit: cover;
      background: #f4efe6;
    }

    .prod-table-name {
      display: block;
      color: #1c211e;
      font-weight: 600;
    }

    .prod-table-size {
      display: block;
      color: #646d68;
      font-size: 0.7rem;
    }

    .category-chip {
      font-size: 0.725rem;
      color: #4e6b5d;
      background: rgba(78, 107, 93, 0.08);
      padding: 0.15rem 0.5rem;
      border-radius: 4px;
      white-space: nowrap;
    }

    .sale-price {
      font-weight: 700;
      color: #c94a4a;
      margin-right: 0.3rem;
    }

    .orig-price {
      text-decoration: line-through;
      color: #949c97;
      font-size: 0.75rem;
    }

    .stock-pill {
      font-size: 0.75rem;
      color: #2b332f;
      background: #f4efe6;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      white-space: nowrap;

      &.stock-low {
        background: #fef2f2;
        color: #ef4444;
        font-weight: 700;
      }
    }

    .badge-bestseller {
      background: #fef3c7;
      color: #92400e;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
    }

    .badge-new {
      background: #dbeafe;
      color: #1e40af;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
    }

    .badge-plain {
      font-size: 0.7rem;
      color: #646d68;
    }

    .table-actions {
      display: flex;
      gap: 0.35rem;
    }

    .btn-table-edit {
      padding: 0.25rem 0.55rem;
      font-size: 0.725rem;
      border-radius: 4px;
      background: #f4efe6;
      border: 1px solid #e8e2d8;
      cursor: pointer;
      color: #1c211e;

      &:hover { background: #e8e0d2; }
    }

    .btn-table-del {
      padding: 0.25rem 0.55rem;
      font-size: 0.725rem;
      border-radius: 4px;
      background: #fef2f2;
      color: #dc2626;
      border: 1px solid #fecaca;
      cursor: pointer;

      &:hover { background: #fee2e2; }
    }

    /* Messages & Reviews */
    .msg-sub {
      color: #1c211e;
    }

    .msg-col {
      max-width: 260px;
      font-size: 0.785rem;
      line-height: 1.35;
      color: #4b5563;
    }

    .text-reviewed {
      font-size: 0.75rem;
      color: #9ca3af;
    }

    .star-rating {
      font-weight: 700;
      color: #d97706;
      font-size: 0.8rem;
    }

    .rev-title {
      display: block;
      font-size: 0.8rem;
      color: #1c211e;
    }

    .rev-snippet {
      margin: 0.15rem 0 0;
      font-size: 0.75rem;
      color: #6b7280;
      max-width: 280px;
    }

    .empty-table-cell {
      text-align: center;
      padding: 2.5rem 1rem !important;
      color: #949c97;
    }

    /* Product Drawer Form */
    .product-form-box {
      background: #f7f3ec;
      border: 1px solid #e8e2d8;
      border-radius: 10px;
      padding: 1.25rem;
      margin-bottom: 1.25rem;

      .form-box-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h3 { margin: 0; font-size: 1.05rem; }
        .close-box-btn {
          background: none;
          border: none;
          font-size: 1.1rem;
          cursor: pointer;
          color: #646d68;
        }
      }
    }

    .form-row {
      display: flex;
      gap: 0.85rem;
      margin-bottom: 0.85rem;
      .flex-1 { flex: 1; }
    }

    .form-group {
      margin-bottom: 0.85rem;

      .form-label {
        display: block;
        font-size: 0.75rem;
        font-weight: 600;
        margin-bottom: 0.3rem;
        color: #2b332f;
      }

      .form-control {
        width: 100%;
        padding: 0.45rem 0.65rem;
        border: 1px solid #e8e2d8;
        border-radius: 6px;
        background: #ffffff;
        font-size: 0.825rem;
        font-family: inherit;
        outline: none;

        &:focus {
          border-color: #4e6b5d;
        }
      }
    }

    .form-actions-row {
      display: flex;
      gap: 0.65rem;
      margin-top: 1rem;
    }

    .user-avatar-small {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: #4e6b5d;
      color: #ffffff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 700;
      flex-shrink: 0;
    }

    .primary-badge {
      display: inline-block;
      margin-left: 0.4rem;
      font-size: 0.625rem;
      font-weight: 700;
      background: rgba(198, 167, 121, 0.2);
      color: #8b6e4e;
      padding: 0.1rem 0.4rem;
      border-radius: 4px;
      border: 1px solid rgba(198, 167, 121, 0.35);
    }

    /* --------------------------------------------------------------------------
       3. ORDER DETAILS MODAL
       -------------------------------------------------------------------------- */
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(0, 0, 0, 0.45);
      backdrop-filter: blur(4px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }

    .order-modal-card {
      background: #ffffff;
      border-radius: 12px;
      width: 100%;
      max-width: 580px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
      overflow: hidden;

      .modal-header {
        padding: 1.25rem 1.5rem;
        border-bottom: 1px solid #e8e2d8;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .modal-sub {
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #c6a779;
        }

        h3 { margin: 0; font-size: 1.2rem; }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
          color: #646d68;
        }
      }

      .modal-body {
        padding: 1.25rem 1.5rem;
        overflow-y: auto;
      }

      .modal-grid-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
        margin-bottom: 1.25rem;
      }

      .modal-box {
        background: #f7f3ec;
        border: 1px solid #e8e2d8;
        border-radius: 8px;
        padding: 0.85rem;
        font-size: 0.8rem;
        line-height: 1.35;

        .box-label {
          display: block;
          font-size: 0.65rem;
          font-weight: 700;
          color: #646d68;
          text-transform: uppercase;
          margin-bottom: 0.35rem;
        }

        p { margin: 0.15rem 0; }
      }

      .modal-items-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        .box-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: #646d68;
          text-transform: uppercase;
        }
      }

      .order-item-row {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.5rem 0;
        border-bottom: 1px solid #f0ebe2;

        .modal-item-thumb {
          width: 36px;
          height: 36px;
          border-radius: 4px;
          object-fit: cover;
        }

        .modal-item-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          font-size: 0.8rem;
          small { color: #646d68; }
        }

        .item-subtotal {
          font-size: 0.85rem;
        }
      }

      .modal-footer {
        padding: 0.85rem 1.5rem;
        border-top: 1px solid #e8e2d8;
        display: flex;
        justify-content: flex-end;
      }
    }

    /* --------------------------------------------------------------------------
       MOBILE & RESPONSIVE BREAKPOINTS
       -------------------------------------------------------------------------- */
    .mobile-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      z-index: 90;
    }

    @media (max-width: 1024px) {
      .admin-sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100vh;
        transform: translateX(-100%);
      }

      .admin-sidebar.open {
        transform: translateX(0);
      }

      .sidebar-brand .mobile-close-btn {
        display: block;
      }

      .admin-header-bar .mobile-toggle-btn {
        display: block;
      }

      .admin-kpi-strip {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 640px) {
      .admin-header-bar {
        padding: 0 1rem;

        .admin-search-box {
          display: none;
        }
      }

      .admin-kpi-strip {
        grid-template-columns: 1fr;
        padding: 0.75rem 1rem;
      }

      .admin-content-view {
        padding: 0.75rem 1rem;
      }

      .modal-grid-2 {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly productService = inject(ProductService);
  private readonly contactService = inject(ContactService);
  private readonly reviewService = inject(ReviewService);
  private readonly toast = inject(ToastService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public readonly activeTab = signal<'orders' | 'products' | 'admins' | 'messages' | 'reviews'>('orders');
  public readonly isMobileSidebarOpen = signal<boolean>(false);
  public searchFilter: string = '';

  // Data signals
  public readonly stats = signal<any>({});
  public readonly orders = signal<Order[]>([]);
  public readonly products = signal<Product[]>([]);
  public readonly admins = signal<any[]>([]);
  public readonly messages = signal<ContactMessage[]>([]);
  public readonly reviews = signal<Review[]>([]);

  // Selected Order Modal
  public readonly selectedOrder = signal<Order | null>(null);

  // Admin Create state
  public readonly isAdminModalOpen = signal<boolean>(false);
  public isSubmittingAdmin: boolean = false;
  public adminForm = {
    name: '',
    email: '',
    password: '',
    phone: ''
  };

  // Product Create / Edit state
  public readonly isProductModalOpen = signal<boolean>(false);
  public readonly editingProduct = signal<Product | null>(null);

  public prodForm = {
    name: '',
    category: 'Serums & Ampoules',
    price: 1199,
    salePrice: undefined as number | undefined,
    stock: 45,
    size: '50 ml / 1.7 fl. oz.',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
    description: 'Handcrafted botanical formulation with clinical actives.'
  };

  public readonly unreadMessagesCount = computed(() => {
    return this.messages().filter((m) => m.status === 'unread').length;
  });

  public readonly currentTabTitle = computed(() => {
    switch (this.activeTab()) {
      case 'orders': return 'Orders Management';
      case 'products': return 'Product Catalog';
      case 'admins': return 'Administrator Management';
      case 'messages': return 'Client Inquiries';
      case 'reviews': return 'Reviews Moderation';
      default: return 'Management Console';
    }
  });

  // Filtered queries for instant search
  public readonly filteredOrders = computed(() => {
    const q = this.searchFilter.trim().toLowerCase();
    if (!q) return this.orders();
    return this.orders().filter((o) =>
      o.orderNumber.toLowerCase().includes(q) ||
      o.shippingAddress.fullName.toLowerCase().includes(q) ||
      o.shippingAddress.email.toLowerCase().includes(q) ||
      o.orderStatus.toLowerCase().includes(q)
    );
  });

  public readonly filteredProducts = computed(() => {
    const q = this.searchFilter.trim().toLowerCase();
    if (!q) return this.products();
    return this.products().filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });

  public readonly filteredAdmins = computed(() => {
    const q = this.searchFilter.trim().toLowerCase();
    if (!q) return this.admins();
    return this.admins().filter((a) =>
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      (a.phone && a.phone.toLowerCase().includes(q))
    );
  });

  public readonly filteredMessages = computed(() => {
    const q = this.searchFilter.trim().toLowerCase();
    if (!q) return this.messages();
    return this.messages().filter((m) =>
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q)
    );
  });

  public readonly filteredReviews = computed(() => {
    const q = this.searchFilter.trim().toLowerCase();
    if (!q) return this.reviews();
    return this.reviews().filter((r) =>
      r.userName.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q)
    );
  });

  ngOnInit(): void {
    this.loadDashboardStats();
    this.loadOrders();
    this.loadProducts();
    this.loadAdmins();
    this.loadMessages();
    this.loadReviews();
  }

  public selectTab(tab: 'orders' | 'products' | 'admins' | 'messages' | 'reviews'): void {
    this.activeTab.set(tab);
    this.isMobileSidebarOpen.set(false);
    this.searchFilter = '';
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  private loadDashboardStats(): void {
    this.orderService.getAdminDashboard().subscribe({
      next: (res) => {
        if (res.success) {
          this.stats.set(res.stats);
        }
      }
    });
  }

  private loadOrders(): void {
    this.orderService.getAdminOrders().subscribe({
      next: (res) => this.orders.set(res.orders)
    });
  }

  private loadProducts(): void {
    this.productService.getProducts({ limit: 50 }).subscribe({
      next: (res) => this.products.set(res.products)
    });
  }

  private loadMessages(): void {
    this.contactService.getAdminMessages().subscribe({
      next: (res) => this.messages.set(res.messages)
    });
  }

  private loadReviews(): void {
    this.reviewService.getAdminReviews().subscribe({
      next: (res) => this.reviews.set(res.reviews)
    });
  }

  public onUpdateOrderStatus(order: Order, newStatus: string): void {
    const id = (order._id || order.id || order.orderNumber)!;
    this.orderService.updateOrderStatus(id, newStatus).subscribe({
      next: (res) => {
        this.toast.success(`Order ${order.orderNumber} updated to "${newStatus}"`);
        order.orderStatus = res.order.orderStatus;
      },
      error: () => this.toast.error('Failed to update order status.')
    });
  }

  public viewOrderDetails(order: Order): void {
    this.selectedOrder.set(order);
  }

  public openCreateProductModal(): void {
    this.editingProduct.set(null);
    this.prodForm = {
      name: '',
      category: 'Serums & Ampoules',
      price: 1199,
      salePrice: undefined,
      stock: 45,
      size: '50 ml / 1.7 fl. oz.',
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
      description: 'Handcrafted botanical formulation with clinical actives.'
    };
    this.isProductModalOpen.set(true);
  }

  public openEditProductModal(p: Product): void {
    this.editingProduct.set(p);
    this.prodForm = {
      name: p.name,
      category: p.category,
      price: p.price,
      salePrice: p.salePrice,
      stock: p.stock,
      size: p.size,
      imageUrl: p.images[0],
      description: p.description
    };
    this.isProductModalOpen.set(true);
  }

  public onSaveProduct(e: Event): void {
    e.preventDefault();
    const payload = {
      name: this.prodForm.name,
      category: this.prodForm.category,
      price: Number(this.prodForm.price),
      salePrice: this.prodForm.salePrice ? Number(this.prodForm.salePrice) : undefined,
      stock: Number(this.prodForm.stock),
      size: this.prodForm.size,
      images: [this.prodForm.imageUrl],
      description: this.prodForm.description
    };

    if (this.editingProduct()) {
      const id = (this.editingProduct()!.id || this.editingProduct()!._id)!;
      this.productService.updateProduct(id, payload).subscribe({
        next: () => {
          this.toast.success('Formulation updated successfully!');
          this.isProductModalOpen.set(false);
          this.loadProducts();
        },
        error: () => this.toast.error('Error updating product.')
      });
    } else {
      this.productService.createProduct(payload).subscribe({
        next: () => {
          this.toast.success('New formulation added to catalog!');
          this.isProductModalOpen.set(false);
          this.loadProducts();
          this.loadDashboardStats();
        },
        error: () => this.toast.error('Error creating product.')
      });
    }
  }

  public onDeleteProduct(p: Product): void {
    if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
      const id = (p.id || p._id)!;
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.toast.success('Product deleted.');
          this.loadProducts();
          this.loadDashboardStats();
        },
        error: () => this.toast.error('Error deleting product.')
      });
    }
  }

  public markMessageRead(msg: ContactMessage): void {
    const id = (msg._id || msg.id)!;
    this.contactService.markMessageStatus(id, 'read').subscribe({
      next: () => {
        msg.status = 'read';
        this.toast.success('Inquiry marked as read.');
      }
    });
  }

  public deleteReview(rev: Review): void {
    if (confirm('Delete this review?')) {
      const id = (rev._id || rev.id)!;
      this.reviewService.deleteReview(id).subscribe({
        next: () => {
          this.toast.success('Review removed.');
          this.loadReviews();
        }
      });
    }
  }

  public loadAdmins(): void {
    this.orderService.getAdminList().subscribe({
      next: (res) => {
        if (res.success && res.admins) {
          this.admins.set(res.admins);
        }
      },
      error: (err) => console.warn('Could not load admins list', err)
    });
  }

  public openCreateAdminModal(): void {
    this.adminForm = {
      name: '',
      email: '',
      password: '',
      phone: ''
    };
    this.isAdminModalOpen.set(true);
  }

  public onCreateAdmin(e: Event): void {
    e.preventDefault();
    if (!this.adminForm.name.trim() || !this.adminForm.email.trim() || !this.adminForm.password) {
      this.toast.error('Please fill in name, email, and password.');
      return;
    }

    if (this.adminForm.password.length < 6) {
      this.toast.error('Password must be at least 6 characters long.');
      return;
    }

    this.isSubmittingAdmin = true;
    this.orderService.createAdmin(this.adminForm).subscribe({
      next: (res) => {
        this.isSubmittingAdmin = false;
        this.toast.success(res.message || 'New Administrator created successfully!');
        this.isAdminModalOpen.set(false);
        this.loadAdmins();
      },
      error: (err) => {
        this.isSubmittingAdmin = false;
        const msg = err.error?.message || 'Failed to create administrator.';
        this.toast.error(msg);
      }
    });
  }

  public onDeleteAdmin(adm: any): void {
    const id = adm._id || adm.id;
    if (confirm(`Are you sure you want to remove admin access for "${adm.name}" (${adm.email})?`)) {
      this.orderService.deleteAdmin(id).subscribe({
        next: (res) => {
          this.toast.success(res.message || 'Administrator removed.');
          this.loadAdmins();
        },
        error: (err) => {
          const msg = err.error?.message || 'Failed to delete administrator.';
          this.toast.error(msg);
        }
      });
    }
  }
}

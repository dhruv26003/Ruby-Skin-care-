import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { CartService } from '../../core/services/cart.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ReviewService } from '../../core/services/review-contact.service';
import { ToastService } from '../../core/services/toast.service';
import { Product } from '../../core/models/product.model';
import { Review } from '../../core/models/common.model';
import { RatingStarsComponent } from '../../shared/components/rating-stars/rating-stars.component';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, RatingStarsComponent, ProductCardComponent],
  template: `
    @if (isLoading()) {
      <div class="container section-padding">
        <div class="details-skeleton">
          <div class="skeleton-media"></div>
          <div class="skeleton-info"></div>
        </div>
      </div>
    } @else if (product()) {
      <div class="product-details-page">
        <!-- Breadcrumbs -->
        <div class="container">
          <nav class="breadcrumb-nav">
            <a routerLink="/">Home</a>
            <span>/</span>
            <a routerLink="/products">Shop</a>
            <span>/</span>
            <a [routerLink]="['/products']" [queryParams]="{category: product()!.categorySlug}">
              {{ product()!.category }}
            </a>
            <span>/</span>
            <span class="active-crumb">{{ product()!.name }}</span>
          </nav>
        </div>

        <!-- Main Product Section -->
        <section class="container product-main-grid">
          <!-- Left: Gallery Media -->
          <div class="product-gallery">
            <div class="main-image-wrap">
              <img
                [src]="activeImage() || product()!.images[0]"
                [alt]="product()!.name"
                class="active-img"
              />
              @if (product()!.onSale) {
                <span class="badge badge-sale discount-pill">
                  SALE
                </span>
              }
            </div>

            @if (product()!.images.length > 1) {
              <div class="thumbnail-strip">
                @for (img of product()!.images; track img) {
                  <button
                    class="thumb-btn"
                    [class.active]="activeImage() === img"
                    (click)="activeImage.set(img)"
                  >
                    <img [src]="img" [alt]="product()!.name" />
                  </button>
                }
              </div>
            }
          </div>

          <!-- Right: Purchase Details -->
          <div class="product-info-panel">
            <span class="product-meta-cat">{{ product()!.category }}</span>
            <h1 class="details-title">{{ product()!.name }}</h1>

            <div class="details-rating-row">
              <app-rating-stars [rating]="product()!.rating" [reviewCount]="product()!.reviewCount"></app-rating-stars>
              <a href="#reviews" class="jump-reviews">Read {{ product()!.reviewCount }} Verified Reviews</a>
            </div>

            <!-- Price -->
            <div class="details-price-row">
              @if (product()!.onSale && product()!.salePrice) {
                <span class="sale-price">₹{{ product()!.salePrice!.toFixed(0) }}</span>
                <span class="original-price">₹{{ product()!.price.toFixed(0) }}</span>
                <span class="savings-tag">Save ₹{{ (product()!.price - product()!.salePrice!).toFixed(0) }}</span>
              } @else {
                <span class="regular-price">₹{{ product()!.price.toFixed(0) }}</span>
              }
            </div>

            <!-- Short Description -->
            <p class="details-short-desc">
              {{ product()!.shortDescription || product()!.description }}
            </p>

            <!-- Suitable Skin Concerns & Types -->
            <div class="specs-tags-wrap">
              <div class="spec-group">
                <span class="spec-label">Target Concerns:</span>
                <div class="spec-tags">
                  @for (c of product()!.skinConcerns; track c) {
                    <span class="tag-pill">{{ c }}</span>
                  }
                </div>
              </div>
              <div class="spec-group">
                <span class="spec-label">Ideal For:</span>
                <div class="spec-tags">
                  @for (t of product()!.skinTypes; track t) {
                    <span class="tag-pill accent">{{ t }}</span>
                  }
                </div>
              </div>
            </div>

            <!-- Quantity & Actions -->
            <div class="purchase-box">
              <div class="quantity-stepper">
                <button
                  type="button"
                  (click)="decreaseQty()"
                  [disabled]="quantity() <= 1"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span class="quantity-num">{{ quantity() }}</span>
                <button
                  type="button"
                  (click)="increaseQty()"
                  [disabled]="quantity() >= product()!.stock"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <button class="btn btn-primary btn-lg add-bag-btn" (click)="addToCart()">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                Add To Bag • ₹{{ getLinePrice().toFixed(0) }}
              </button>

              <button
                class="btn-icon wishlist-toggle-large"
                [class.active]="isWishlisted()"
                (click)="toggleWishlist()"
                [attr.aria-label]="isWishlisted() ? 'Remove from wishlist' : 'Add to wishlist'"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" [attr.fill]="isWishlisted() ? '#c94a4a' : 'none'" [attr.stroke]="isWishlisted() ? '#c94a4a' : 'currentColor'" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
              </button>
            </div>

            <!-- In-Stock Status -->
            <div class="inventory-status">
              @if (product()!.stock > 10) {
                <span class="in-stock-badge">✓ In Stock ({{ product()!.stock }} units available)</span>
              } @else if (product()!.stock > 0) {
                <span class="low-stock-badge">⚠️ Only {{ product()!.stock }} bottles remaining!</span>
              } @else {
                <span class="out-of-stock-badge">Sold Out</span>
              }
              <span class="sku-info">Size: {{ product()!.size }}</span>
            </div>

            <!-- Perks Bar -->
            <div class="product-perks">
              <div class="perk-item">
                <span class="perk-icon">📦</span>
                <span>Complimentary Delivery On Orders ₹999+</span>
              </div>
              <div class="perk-item">
                <span class="perk-icon">🛡️</span>
                <span>30-Day Pure Skin Guarantee</span>
              </div>
              <div class="perk-item">
                <span class="perk-icon">🌿</span>
                <span>100% Recyclable Glass Vessel</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Information Tabs Section -->
        <section class="container tabs-section">
          <div class="tabs-nav">
            <button
              class="tab-btn"
              [class.active]="activeTab() === 'description'"
              (click)="activeTab.set('description')"
            >
              Description & Benefits
            </button>
            <button
              class="tab-btn"
              [class.active]="activeTab() === 'ingredients'"
              (click)="activeTab.set('ingredients')"
            >
              Ingredients & Actives
            </button>
            <button
              class="tab-btn"
              [class.active]="activeTab() === 'usage'"
              (click)="activeTab.set('usage')"
            >
              How To Apply
            </button>
          </div>

          <div class="tab-content-card">
            @if (activeTab() === 'description') {
              <div class="tab-pane">
                <h3>The Clinical Formulation</h3>
                <p class="tab-lead">{{ product()!.description }}</p>
                @if (product()!.benefits && product()!.benefits.length > 0) {
                  <h4 class="mt-4">Proven Key Benefits</h4>
                  <ul class="benefits-checklist">
                    @for (benefit of product()!.benefits; track benefit) {
                      <li>
                        <span class="check-icon">✓</span>
                        <span>{{ benefit }}</span>
                      </li>
                    }
                  </ul>
                }
              </div>
            }

            @if (activeTab() === 'ingredients') {
              <div class="tab-pane">
                <h3>Full Ingredient Transparency</h3>
                <p>We declare every single ingredient with zero hidden fillers or undisclosed fragrances.</p>
                <div class="ingredients-list-wrap">
                  @for (ing of product()!.ingredients; track ing) {
                    <div class="ingredient-badge">{{ ing }}</div>
                  }
                </div>
              </div>
            }

            @if (activeTab() === 'usage') {
              <div class="tab-pane">
                <h3>Ritual & Application</h3>
                <p class="tab-lead">{{ product()!.usageInstructions }}</p>
                <div class="routine-step-tip">
                  <strong>💡 Esthetician Tip:</strong> Always layer products from thinnest consistency to thickest (Cleanser → Toner → Serum → Moisturizer → Sunscreen in AM).
                </div>
              </div>
            }
          </div>
        </section>

        <!-- Customer Reviews Section -->
        <section id="reviews" class="container section-padding reviews-section">
          <div class="section-header">
            <span class="section-tagline">COMMUNITY VERIFIED</span>
            <h2>Client Reviews & Experiences</h2>
            <p>Every review is contributed by verified users following continuous treatment rituals.</p>
          </div>

          <div class="reviews-layout">
            <!-- Review Stats & Write Form -->
            <div class="write-review-card">
              <h3>Share Your Experience</h3>
              <p>How did this formulation enhance your natural glow?</p>

              <form (submit)="onSubmitReview($event)" class="review-form">
                <div class="form-group">
                  <label class="form-label">Your Rating</label>
                  <div class="star-rating-select">
                    @for (s of [1,2,3,4,5]; track s) {
                      <button
                        type="button"
                        class="star-select-btn"
                        [class.active]="newReviewRating >= s"
                        (click)="newReviewRating = s"
                      >
                        ★
                      </button>
                    }
                    <span class="rating-select-text">{{ newReviewRating }} / 5 Stars</span>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Review Headline</label>
                  <input
                    type="text"
                    [(ngModel)]="newReviewTitle"
                    name="reviewTitle"
                    placeholder="e.g., Noticeable glow in 2 weeks!"
                    class="form-control"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">Your Review</label>
                  <textarea
                    [(ngModel)]="newReviewComment"
                    name="reviewComment"
                    placeholder="Share specific changes in skin texture, hydration, or brightness..."
                    class="form-control"
                    required
                  ></textarea>
                </div>

                <button type="submit" class="btn btn-primary" [disabled]="isSubmittingReview">
                  {{ isSubmittingReview ? 'Submitting...' : 'Post Review' }}
                </button>
              </form>
            </div>

            <!-- Reviews List -->
            <div class="reviews-list">
              @if (reviews().length > 0) {
                @for (rev of reviews(); track rev._id || rev.id) {
                  <div class="review-item-card">
                    <div class="rev-header">
                      <app-rating-stars [rating]="rev.rating"></app-rating-stars>
                      <span class="rev-date">{{ rev.createdAt | date: 'mediumDate' }}</span>
                    </div>
                    <h4 class="rev-title">{{ rev.title }}</h4>
                    <p class="rev-comment">{{ rev.comment }}</p>
                    <div class="rev-author">
                      <span class="rev-user">{{ rev.userName }}</span>
                      @if (rev.verifiedPurchase) {
                        <span class="rev-verified">✓ Verified Client</span>
                      }
                    </div>
                  </div>
                }
              } @else {
                <div class="empty-reviews">
                  <p>Be the first verified customer to share feedback on this treatment!</p>
                </div>
              }
            </div>
          </div>
        </section>

        <!-- Related Products Section -->
        @if (relatedProducts().length > 0) {
          <section class="container section-padding related-section">
            <div class="section-header">
              <span class="section-tagline">HARMONIOUS PAIRINGS</span>
              <h2>Complete Your Skincare Ritual</h2>
              <p>Formulations specifically designed to boost each other's efficacy.</p>
            </div>

            <div class="grid-4">
              @for (related of relatedProducts(); track related.id || related._id) {
                <app-product-card [product]="related"></app-product-card>
              }
            </div>
          </section>
        }
      </div>
    }
  `,
  styles: [`
    .breadcrumb-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1.5rem 0;
      font-size: 0.85rem;
      color: var(--color-muted, #646d68);

      a {
        color: var(--color-charcoal, #1c211e);
        &:hover { color: var(--color-primary, #4e6b5d); }
      }

      .active-crumb {
        color: var(--color-primary, #4e6b5d);
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .product-main-grid {
      display: grid;
      grid-template-columns: 1fr 1.15fr;
      gap: 4rem;
      align-items: start;
      margin-bottom: 4rem;
    }

    /* Gallery */
    .product-gallery {
      position: sticky;
      top: 90px;

      .main-image-wrap {
        position: relative;
        border-radius: var(--radius-lg, 20px);
        overflow: hidden;
        background-color: var(--color-beige, #f4efe6);
        box-shadow: 0 12px 35px rgba(28, 33, 30, 0.08);
        border: 1px solid var(--color-border, #e8e2d8);
        padding-top: 100%;

        .active-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .discount-pill {
          position: absolute;
          top: 1.25rem;
          left: 1.25rem;
        }
      }

      .thumbnail-strip {
        display: flex;
        gap: 0.75rem;
        margin-top: 1rem;

        .thumb-btn {
          width: 76px;
          height: 76px;
          border-radius: var(--radius-sm, 8px);
          overflow: hidden;
          border: 2px solid transparent;
          background: var(--color-beige, #f4efe6);
          cursor: pointer;
          padding: 0;
          transition: border-color 0.2s;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          &.active {
            border-color: var(--color-primary, #4e6b5d);
          }
        }
      }
    }

    /* Info Panel */
    .product-info-panel {
      .product-meta-cat {
        font-size: 0.8rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--color-accent-gold, #c6a779);
        font-weight: 700;
        margin-bottom: 0.5rem;
        display: block;
      }

      .details-title {
        font-size: clamp(2rem, 3.5vw, 2.75rem);
        margin-bottom: 0.75rem;
      }

      .details-rating-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;

        .jump-reviews {
          font-size: 0.85rem;
          color: var(--color-primary, #4e6b5d);
          font-weight: 500;
          text-decoration: underline;
        }
      }

      .details-price-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 1.5rem;

        .regular-price, .sale-price {
          font-size: 2rem;
          font-weight: 700;
          color: var(--color-charcoal, #1c211e);
        }

        .sale-price { color: #a84242; }

        .original-price {
          font-size: 1.25rem;
          color: var(--color-muted-light, #949c97);
          text-decoration: line-through;
        }

        .savings-tag {
          font-size: 0.8rem;
          background-color: var(--color-blush, #f7ebe6);
          color: #a84242;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full, 9999px);
          font-weight: 700;
        }
      }

      .details-short-desc {
        font-size: 1.05rem;
        line-height: 1.8;
        margin-bottom: 2rem;
        color: var(--color-charcoal, #1c211e);
      }
    }

    .specs-tags-wrap {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 2rem;
      padding: 1.25rem;
      background: var(--color-beige, #f4efe6);
      border-radius: var(--radius-sm, 8px);

      .spec-group {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-wrap: wrap;

        .spec-label {
          font-size: 0.825rem;
          font-weight: 700;
          color: var(--color-charcoal, #1c211e);
          min-width: 120px;
        }

        .spec-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
        }

        .tag-pill {
          font-size: 0.75rem;
          padding: 0.25rem 0.65rem;
          border-radius: var(--radius-full, 9999px);
          background: var(--color-white, #fff);
          border: 1px solid var(--color-border, #e8e2d8);
          color: var(--color-charcoal, #1c211e);

          &.accent {
            background-color: var(--color-primary-soft, rgba(78, 107, 93, 0.1));
            color: var(--color-primary-dark, #2f4339);
            font-weight: 600;
          }
        }
      }
    }

    /* Purchase Box */
    .purchase-box {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;

      .quantity-stepper {
        display: flex;
        align-items: center;
        background: var(--color-white, #fff);
        border: 1px solid var(--color-border, #e8e2d8);
        border-radius: var(--radius-full, 9999px);
        padding: 0.25rem 0.75rem;
        height: 52px;

        button {
          background: none;
          border: none;
          font-size: 1.25rem;
          width: 32px;
          height: 32px;
          cursor: pointer;
          color: var(--color-charcoal, #1c211e);
          display: flex;
          align-items: center;
          justify-content: center;

          &:disabled { opacity: 0.3; cursor: not-allowed; }
        }

        .quantity-num {
          font-size: 1rem;
          font-weight: 600;
          min-width: 30px;
          text-align: center;
        }
      }

      .add-bag-btn {
        flex: 1;
        min-width: 240px;
        height: 52px;
      }

      .wishlist-toggle-large {
        width: 52px;
        height: 52px;
        flex-shrink: 0;

        &.active {
          color: #c94a4a;
        }
      }
    }

    .inventory-status {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid var(--color-border, #e8e2d8);
      margin-bottom: 1.75rem;
      font-size: 0.85rem;

      .in-stock-badge {
        color: var(--color-success, #3c7d5c);
        font-weight: 600;
      }

      .low-stock-badge {
        color: var(--color-warning, #d9822b);
        font-weight: 600;
      }

      .sku-info {
        color: var(--color-muted, #646d68);
      }
    }

    .product-perks {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      .perk-item {
        display: flex;
        align-items: center;
        gap: 0.6rem;
        font-size: 0.85rem;
        color: var(--color-charcoal, #1c211e);
      }
    }

    /* Tabs */
    .tabs-section {
      margin-bottom: 4rem;

      .tabs-nav {
        display: flex;
        gap: 1rem;
        border-bottom: 1px solid var(--color-border, #e8e2d8);
        margin-bottom: 2rem;
      }

      .tab-btn {
        background: none;
        border: none;
        font-family: var(--font-serif, Georgia, serif);
        font-size: 1.25rem;
        color: var(--color-muted, #646d68);
        padding: 0.75rem 1rem;
        cursor: pointer;
        position: relative;
        transition: color 0.2s;

        &::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0;
          height: 3px;
          background: var(--color-primary, #4e6b5d);
          transition: width 0.2s;
        }

        &.active {
          color: var(--color-charcoal, #1c211e);
          font-weight: 600;
          &::after { width: 100%; }
        }
      }

      .tab-content-card {
        background: var(--color-white, #fff);
        border: 1px solid var(--color-border, #e8e2d8);
        border-radius: var(--radius-md, 14px);
        padding: 2.5rem;

        h3 { margin-bottom: 1rem; }
        .tab-lead { font-size: 1.05rem; line-height: 1.8; margin-bottom: 1.5rem; }

        .benefits-checklist {
          list-style: none;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin-top: 1.25rem;

          li {
            display: flex;
            align-items: flex-start;
            gap: 0.5rem;
            font-size: 0.95rem;

            .check-icon {
              color: var(--color-primary, #4e6b5d);
              font-weight: 700;
            }
          }
        }

        .ingredients-list-wrap {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-top: 1.25rem;

          .ingredient-badge {
            background: var(--color-beige, #f4efe6);
            border: 1px solid var(--color-border, #e8e2d8);
            padding: 0.5rem 1rem;
            border-radius: var(--radius-full, 9999px);
            font-size: 0.85rem;
            color: var(--color-charcoal, #1c211e);
          }
        }

        .routine-step-tip {
          margin-top: 1.5rem;
          background: var(--color-primary-soft, rgba(78, 107, 93, 0.08));
          padding: 1rem 1.25rem;
          border-radius: var(--radius-sm, 8px);
          font-size: 0.9rem;
          color: var(--color-primary-dark, #2f4339);
        }
      }
    }

    /* Reviews Section */
    .reviews-layout {
      display: grid;
      grid-template-columns: 380px 1fr;
      gap: 3rem;
      align-items: start;
    }

    .write-review-card {
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      padding: 2rem;

      h3 { margin-bottom: 0.5rem; font-size: 1.35rem; }
      p { font-size: 0.85rem; margin-bottom: 1.5rem; }

      .star-rating-select {
        display: flex;
        align-items: center;
        gap: 0.35rem;

        .star-select-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #dfd8cb;
          cursor: pointer;
          transition: color 0.15s;

          &.active {
            color: #d4a359;
          }
        }

        .rating-select-text {
          font-size: 0.85rem;
          font-weight: 600;
          margin-left: 0.5rem;
        }
      }
    }

    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;

      .review-item-card {
        background: var(--color-white, #fff);
        border: 1px solid var(--color-border, #e8e2d8);
        border-radius: var(--radius-md, 14px);
        padding: 1.75rem;

        .rev-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;

          .rev-date {
            font-size: 0.75rem;
            color: var(--color-muted, #646d68);
          }
        }

        .rev-title {
          font-size: 1.05rem;
          margin-bottom: 0.5rem;
        }

        .rev-comment {
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 1rem;
        }

        .rev-author {
          display: flex;
          align-items: center;
          gap: 0.75rem;

          .rev-user {
            font-size: 0.85rem;
            font-weight: 600;
            color: var(--color-charcoal, #1c211e);
          }

          .rev-verified {
            font-size: 0.75rem;
            color: var(--color-primary, #4e6b5d);
            font-weight: 600;
          }
        }
      }

      .empty-reviews {
        padding: 3rem;
        text-align: center;
        background: var(--color-white, #fff);
        border-radius: var(--radius-md, 14px);
        border: 1px dashed var(--color-border, #e8e2d8);
      }
    }

    @media (max-width: 992px) {
      .product-main-grid {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
      .reviews-layout {
        grid-template-columns: 1fr;
      }
      .tabs-section .tab-content-card .benefits-checklist {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 600px) {
      .product-gallery .main-image-wrap {
        height: clamp(280px, 65vw, 400px);
      }

      .purchase-actions {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;

        .quantity-selector {
          width: 100%;
          justify-content: center;
        }

        .add-bag-btn {
          width: 100%;
          min-width: unset;
        }
      }

      .tabs-section {
        .tabs-nav {
          overflow-x: auto;
          white-space: nowrap;
          flex-wrap: nowrap;
          gap: 0.5rem;
          -webkit-overflow-scrolling: touch;
          padding-bottom: 0.4rem;

          .tab-btn {
            font-size: 1.05rem;
            padding: 0.5rem 0.75rem;
          }
        }

        .tab-content-card {
          padding: 1.5rem 1rem;
        }
      }

      .write-review-card {
        padding: 1.5rem 1rem;
      }
    }
  `]
})
export class ProductDetailsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(CartService);
  private readonly wishlistService = inject(WishlistService);
  private readonly reviewService = inject(ReviewService);
  private readonly toast = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  public readonly product = signal<Product | null>(null);
  public readonly relatedProducts = signal<Product[]>([]);
  public readonly reviews = signal<Review[]>([]);
  public readonly isLoading = signal<boolean>(true);

  public readonly activeImage = signal<string>('');
  public readonly activeTab = signal<'description' | 'ingredients' | 'usage'>('description');
  public readonly quantity = signal<number>(1);

  // Review Form Model
  public newReviewRating: number = 5;
  public newReviewTitle: string = '';
  public newReviewComment: string = '';
  public isSubmittingReview: boolean = false;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadProduct(id);
      }
    });
  }

  private loadProduct(id: string): void {
    this.isLoading.set(true);
    this.quantity.set(1);

    this.productService.getProductById(id).subscribe({
      next: (res) => {
        this.product.set(res.product);
        this.activeImage.set(res.product.images[0]);
        this.relatedProducts.set(res.related);
        this.isLoading.set(false);

        const productId = (res.product.id || res.product._id)!;
        this.loadReviews(productId);
      },
      error: () => {
        this.isLoading.set(false);
        this.toast.error('Could not find requested product.');
      }
    });
  }

  private loadReviews(productId: string): void {
    this.reviewService.getReviewsForProduct(productId).subscribe({
      next: (res) => this.reviews.set(res.reviews)
    });
  }

  public increaseQty(): void {
    if (this.product() && this.quantity() < this.product()!.stock) {
      this.quantity.update((q) => q + 1);
    }
  }

  public decreaseQty(): void {
    if (this.quantity() > 1) {
      this.quantity.update((q) => q - 1);
    }
  }

  public getLinePrice(): number {
    if (!this.product()) return 0;
    const p = this.product()!.onSale && this.product()!.salePrice ? this.product()!.salePrice! : this.product()!.price;
    return p * this.quantity();
  }

  public addToCart(): void {
    if (this.product()) {
      this.cartService.addToCart(this.product()!, this.quantity());
    }
  }

  public isWishlisted(): boolean {
    if (!this.product()) return false;
    return this.wishlistService.isInWishlist((this.product()!.id || this.product()!._id)!);
  }

  public toggleWishlist(): void {
    if (this.product()) {
      this.wishlistService.toggleWishlist(this.product()!);
    }
  }

  public onSubmitReview(e: Event): void {
    e.preventDefault();
    if (!this.product() || !this.newReviewTitle.trim() || !this.newReviewComment.trim()) return;

    this.isSubmittingReview = true;
    const productId = (this.product()!.id || this.product()!._id)!;

    this.reviewService.submitReview({
      productId,
      rating: this.newReviewRating,
      title: this.newReviewTitle,
      comment: this.newReviewComment
    }).subscribe({
      next: (res) => {
        this.toast.success('Your review was successfully shared!');
        this.reviews.update((current) => [res.review, ...current]);
        this.newReviewTitle = '';
        this.newReviewComment = '';
        this.newReviewRating = 5;
        this.isSubmittingReview = false;
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error submitting review.');
        this.isSubmittingReview = false;
      }
    });
  }
}

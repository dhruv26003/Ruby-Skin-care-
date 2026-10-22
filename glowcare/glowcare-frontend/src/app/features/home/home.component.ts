import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { Product, Category } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';
import { RatingStarsComponent } from '../../shared/components/rating-stars/rating-stars.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductCardComponent, RatingStarsComponent],
  template: `
    <!-- 1. HERO BANNER -->
    <section class="hero-section">
      <div class="container hero-container">
        <div class="hero-content">
          <span class="hero-tag">CONSCIOUS CLINICAL SKINCARE</span>
          <h1 class="hero-title">Your Skin, Your Natural Glow.</h1>
          <p class="hero-description">
            Experience the harmony of potent botanical extracts and dermatological actives. Crafted to restore, illuminate, and safeguard your skin barrier with lasting elegance.
          </p>
          <div class="hero-actions">
            <a routerLink="/products" class="btn btn-primary btn-lg">
              Shop The Collection
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
            </a>
            <a routerLink="/skincare-guide" class="btn btn-secondary btn-lg">
              Explore Routines
            </a>
          </div>

          <div class="hero-guarantees">
            <div class="guarantee-item">
              <span class="guarantee-icon">✨</span>
              <span>100% Vegan & Cruelty-Free</span>
            </div>
            <div class="guarantee-item">
              <span class="guarantee-icon">🧪</span>
              <span>Dermatologically Tested</span>
            </div>
            <div class="guarantee-item">
              <span class="guarantee-icon">🌱</span>
              <span>Sustainably Sourced</span>
            </div>
          </div>
        </div>

        <div class="hero-image-wrap">
          <div class="hero-image-frame">
            <img
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=1000&q=80"
              alt="RubyCare Botanical Serum and Moisturizer"
              class="hero-img"
            />
            <div class="hero-floating-badge">
              <span class="badge-number">98%</span>
              <span class="badge-text">Noticed visible radiance within 14 days</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 2. FOUR PILLARS / BENEFITS SECTION -->
    <section class="benefits-section">
      <div class="container">
        <div class="benefits-grid">
          <div class="benefit-card">
            <div class="benefit-icon">🌿</div>
            <h4>Clean Botanical Actives</h4>
            <p>Formulated without sulfates, parabens, synthetic fragrances, or aggressive drying alcohols.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">🔬</div>
            <h4>Clinically Backed</h4>
            <p>Every active ingredient is dosed at proven therapeutic concentrations for visible results.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">💧</div>
            <h4>Barrier-First Philosophy</h4>
            <p>Formulas engineered to nourish and fortify your microbiome, preventing dehydration.</p>
          </div>
          <div class="benefit-card">
            <div class="benefit-icon">🐰</div>
            <h4>Ethical & Cruelty-Free</h4>
            <p>Certified Leaping Bunny cruelty-free, vegan formulations in recyclable glass packaging.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 3. FEATURED CATEGORIES -->
    <section class="section-padding categories-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tagline">CURATED ESSENTIALS</span>
          <h2>Shop By Category</h2>
          <p>Explore targeted formulations designed for every step of your daily skincare ritual.</p>
        </div>

        <div class="categories-grid">
          @for (cat of categories(); track cat.slug) {
            <a [routerLink]="['/products']" [queryParams]="{category: cat.slug}" class="category-card">
              <div class="cat-image-wrap">
                <img [src]="cat.image" [alt]="cat.name" class="cat-img" loading="lazy" />
                <div class="cat-overlay"></div>
              </div>
              <div class="cat-details">
                <h3 class="cat-name">{{ cat.name }}</h3>
                <span class="cat-link-text">Explore Category →</span>
              </div>
            </a>
          }
        </div>
      </div>
    </section>

    <!-- 4. BESTSELLERS SHOWCASE -->
    <section class="section-padding bestsellers-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tagline">BELOVED BY THOUSANDS</span>
          <h2>Best-Selling Formulations</h2>
          <p>Our most awarded treatments celebrated for transformative barrier support and instant radiance.</p>
        </div>

        <div class="grid-4">
          @for (product of bestsellers(); track product.id || product._id) {
            <app-product-card [product]="product"></app-product-card>
          }
        </div>

        <div class="section-footer-cta">
          <a routerLink="/products" class="btn btn-outline btn-lg">View All Best-Sellers</a>
        </div>
      </div>
    </section>

    <!-- 5. EDITORIAL PROMO BANNER -->
    <section class="promo-banner-section">
      <div class="container">
        <div class="promo-card">
          <div class="promo-content">
            <span class="promo-badge">THE RADIANCE RITUAL</span>
            <h2>Awaken Dull Skin With Vitamin C & Kakadu Plum</h2>
            <p>
              Infused with 15% pure stabilized L-Ascorbic Acid and cold-pressed antioxidants, our award-winning Radiance C+ Elixir neutralizes free radicals while diminishing hyperpigmentation.
            </p>
            <div class="promo-stats">
              <div class="stat-item">
                <strong>+42%</strong>
                <span>Skin Elasticity</span>
              </div>
              <div class="stat-item">
                <strong>-38%</strong>
                <span>Visible Dark Spots</span>
              </div>
              <div class="stat-item">
                <strong>24h</strong>
                <span>Deep Hydration</span>
              </div>
            </div>
            <a routerLink="/products/radiance-c-brightening-elixir-serum" class="btn btn-primary btn-lg">
              Discover Radiance C+
            </a>
          </div>
          <div class="promo-media">
            <img
              src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=900&q=80"
              alt="Radiance C+ Serum Bottle"
              class="promo-img"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- 6. NEW ARRIVALS -->
    <section class="section-padding new-arrivals-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tagline">FRESH FROM THE LAB</span>
          <h2>New Botanical Innovations</h2>
          <p>Cutting-edge biomimetic peptides, calming adaptogens, and multi-molecular hydration therapies.</p>
        </div>

        <div class="grid-4">
          @for (product of newArrivals(); track product.id || product._id) {
            <app-product-card [product]="product"></app-product-card>
          }
        </div>
      </div>
    </section>

    <!-- 7. CUSTOMER TESTIMONIALS -->
    <section class="section-padding testimonials-section">
      <div class="container">
        <div class="section-header">
          <span class="section-tagline">REAL RESULTS</span>
          <h2>Loved By Devoted Skin Enthusiasts</h2>
          <p>Read authentic experiences from verified customers sharing their daily routine milestones.</p>
        </div>

        <div class="testimonials-grid">
          <div class="testimonial-card">
            <div class="test-rating">
              <app-rating-stars [rating]="5"></app-rating-stars>
            </div>
            <p class="test-quote">
              "The Cloud Hydration Barrier Cream is an absolute miracle. After damaging my skin barrier with too many harsh peels, this cream brought immediate soothing relief and restored my skin's plumpness in just 3 days."
            </p>
            <div class="test-author">
              <span class="author-name">Dr. Clara Thorne</span>
              <span class="author-role">Dermatology Resident • Verified Purchase</span>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="test-rating">
              <app-rating-stars [rating]="5"></app-rating-stars>
            </div>
            <p class="test-quote">
              "Finding a 100% mineral sunscreen that doesn't leave any white cast on my darker skin tone seemed impossible until RubyCare. The Invisible Sheer SPF is silky, matte, and gives me full protection every single day."
            </p>
            <div class="test-author">
              <span class="author-name">Amara Okafor</span>
              <span class="author-role">Beauty Editor • Verified Purchase</span>
            </div>
          </div>

          <div class="testimonial-card">
            <div class="test-rating">
              <app-rating-stars [rating]="5"></app-rating-stars>
            </div>
            <p class="test-quote">
              "The Radiance C+ Serum completely changed my morning skincare game. Within one month of daily use, my stubborn acne scarring had faded dramatically, and my complexion looks so vibrant and healthy."
            </p>
            <div class="test-author">
              <span class="author-name">Julian Vance</span>
              <span class="author-role">Lifestyle Creator • Verified Purchase</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. SKINCARE ROUTINE GUIDE TEASER -->
    <section class="routine-teaser-section">
      <div class="container">
        <div class="routine-banner">
          <div class="routine-text">
            <span class="routine-tag">CUSTOMIZED SKIN SCIENCE</span>
            <h2>Not Sure Where To Begin?</h2>
            <p>
              Take our interactive skincare routine planner. Learn how to layer cleansers, toners, serums, and barrier protectors matched precisely to your unique skin type.
            </p>
            <a routerLink="/skincare-guide" class="btn btn-primary btn-lg">Explore Routine Guide</a>
          </div>
          <div class="routine-steps-preview">
            <div class="step-pill">1. Cleanse Gently</div>
            <div class="step-pill">2. Balance & Tone</div>
            <div class="step-pill">3. Treat & Nourish</div>
            <div class="step-pill">4. Shield With SPF</div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    /* Hero */
    .hero-section {
      background: linear-gradient(180deg, var(--color-ivory, #faf7f2) 0%, var(--color-beige, #f4efe6) 100%);
      padding: clamp(3rem, 6vw, 5.5rem) 0 clamp(2.5rem, 5vw, 4.5rem) 0;
      position: relative;
      overflow: hidden;
    }

    .hero-container {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      align-items: center;
      gap: 3.5rem;
    }

    .hero-tag {
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.16em;
      color: var(--color-accent-gold, #c6a779);
      display: inline-block;
      margin-bottom: 0.75rem;
    }

    .hero-title {
      font-size: clamp(2.4rem, 4.5vw, 3.8rem);
      margin-bottom: 1.25rem;
      color: var(--color-charcoal, #1c211e);
      font-family: var(--font-serif, Georgia, serif);
      line-height: 1.15;
    }

    .hero-description {
      font-size: 1.1rem;
      line-height: 1.7;
      margin-bottom: 2rem;
      color: var(--color-muted, #646d68);
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
    }

    .hero-guarantees {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
      padding-top: 1.5rem;
      border-top: 1px solid var(--color-border, #e8e2d8);

      .guarantee-item {
        display: flex;
        align-items: center;
        gap: 0.4rem;
        font-size: 0.85rem;
        color: var(--color-charcoal-light, #2b332f);
        font-weight: 500;
      }
    }

    .hero-image-frame {
      position: relative;
      border-radius: var(--radius-xl, 30px);
      overflow: hidden;
      box-shadow: 0 20px 50px rgba(78, 107, 93, 0.15);

      .hero-img {
        width: 100%;
        height: 520px;
        object-fit: cover;
        display: block;
        transition: transform 0.6s ease;

        &:hover {
          transform: scale(1.03);
        }
      }
    }

    .hero-floating-badge {
      position: absolute;
      bottom: 2rem;
      left: 2rem;
      background: rgba(255, 255, 255, 0.92);
      backdrop-filter: blur(8px);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      padding: 1rem 1.25rem;
      display: flex;
      flex-direction: column;
      max-width: 200px;
      box-shadow: 0 8px 24px rgba(28, 33, 30, 0.08);

      .badge-number {
        font-family: var(--font-serif, Georgia, serif);
        font-size: 2rem;
        font-weight: 700;
        color: var(--color-primary, #4e6b5d);
        line-height: 1;
        margin-bottom: 0.25rem;
      }

      .badge-text {
        font-size: 0.775rem;
        color: var(--color-charcoal, #1c211e);
        font-weight: 500;
        line-height: 1.3;
      }
    }

    /* Benefits 4-Pillars */
    .benefits-section {
      background-color: var(--color-white, #fff);
      padding: 3.5rem 0;
      border-bottom: 1px solid var(--color-border, #e8e2d8);
    }

    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 2rem;
    }

    .benefit-card {
      text-align: center;
      padding: 1rem;

      .benefit-icon {
        font-size: 2rem;
        margin-bottom: 0.75rem;
      }

      h4 {
        font-family: var(--font-sans, sans-serif);
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
        color: var(--color-charcoal, #1c211e);
      }

      p {
        font-size: 0.85rem;
        color: var(--color-muted, #646d68);
        line-height: 1.6;
      }
    }

    /* Categories */
    .categories-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.75rem;
    }

    .category-card {
      position: relative;
      border-radius: var(--radius-md, 14px);
      overflow: hidden;
      background-color: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      display: block;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 12px 30px rgba(28, 33, 30, 0.08);

        .cat-img {
          transform: scale(1.08);
        }

        .cat-link-text {
          color: var(--color-primary, #4e6b5d);
          transform: translateX(4px);
        }
      }
    }

    .cat-image-wrap {
      position: relative;
      height: 220px;
      overflow: hidden;

      .cat-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }

      .cat-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, transparent 40%, rgba(28, 33, 30, 0.4) 100%);
      }
    }

    .cat-details {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .cat-name {
        font-family: var(--font-serif, Georgia, serif);
        font-size: 1.2rem;
        color: var(--color-charcoal, #1c211e);
      }

      .cat-link-text {
        font-size: 0.825rem;
        font-weight: 600;
        color: var(--color-muted, #646d68);
        transition: all 0.2s ease;
      }
    }

    .section-footer-cta {
      text-align: center;
      margin-top: 3rem;
    }

    /* Promo Banner */
    .promo-banner-section {
      padding: 2rem 0;
    }

    .promo-card {
      background-color: var(--color-beige, #f4efe6);
      border-radius: var(--radius-xl, 30px);
      overflow: hidden;
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      align-items: center;
      border: 1px solid var(--color-border, #e8e2d8);
    }

    .promo-content {
      padding: clamp(2.5rem, 5vw, 4.5rem);

      .promo-badge {
        font-size: 0.775rem;
        font-weight: 700;
        letter-spacing: 0.15em;
        color: var(--color-accent-gold, #c6a779);
        display: block;
        margin-bottom: 0.5rem;
      }

      h2 {
        margin-bottom: 1rem;
        font-size: clamp(1.8rem, 3vw, 2.5rem);
      }

      p {
        font-size: 1.05rem;
        line-height: 1.7;
        margin-bottom: 2rem;
      }
    }

    .promo-stats {
      display: flex;
      gap: 2rem;
      margin-bottom: 2.25rem;

      .stat-item {
        display: flex;
        flex-direction: column;

        strong {
          font-family: var(--font-serif, Georgia, serif);
          font-size: 1.8rem;
          color: var(--color-primary, #4e6b5d);
          line-height: 1;
        }

        span {
          font-size: 0.775rem;
          color: var(--color-muted, #646d68);
          margin-top: 0.25rem;
        }
      }
    }

    .promo-media {
      height: 100%;
      min-height: 420px;

      .promo-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    /* Testimonials */
    .testimonials-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;
    }

    .testimonial-card {
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      padding: 2rem;
      display: flex;
      flex-direction: column;
      box-shadow: 0 4px 15px rgba(28, 33, 30, 0.04);

      .test-rating {
        margin-bottom: 1rem;
      }

      .test-quote {
        font-size: 0.95rem;
        line-height: 1.7;
        color: var(--color-charcoal, #1c211e);
        font-style: italic;
        margin-bottom: 1.5rem;
        flex: 1;
      }

      .test-author {
        display: flex;
        flex-direction: column;
        border-top: 1px solid var(--color-border-subtle, #f0ebe2);
        padding-top: 1rem;

        .author-name {
          font-weight: 600;
          color: var(--color-charcoal, #1c211e);
          font-size: 0.9rem;
        }

        .author-role {
          font-size: 0.75rem;
          color: var(--color-primary, #4e6b5d);
          font-weight: 500;
        }
      }
    }

    /* Routine Banner */
    .routine-teaser-section {
      padding: 3rem 0;
    }

    .routine-banner {
      background-color: var(--color-primary-dark, #2f4339);
      color: var(--color-white, #fff);
      border-radius: var(--radius-xl, 30px);
      padding: clamp(2.5rem, 5vw, 4rem);
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 3rem;
      flex-wrap: wrap;

      .routine-text {
        max-width: 550px;

        .routine-tag {
          font-size: 0.775rem;
          letter-spacing: 0.15em;
          color: var(--color-accent-gold-light, #dfcbb0);
          font-weight: 700;
          display: block;
          margin-bottom: 0.5rem;
        }

        h2 {
          color: var(--color-white, #fff);
          margin-bottom: 0.75rem;
        }

        p {
          color: #b7c2bc;
          font-size: 1.05rem;
          margin-bottom: 1.75rem;
        }
      }

      .routine-steps-preview {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        .step-pill {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(5px);
          padding: 0.85rem 1.75rem;
          border-radius: var(--radius-full, 9999px);
          font-size: 0.95rem;
          font-weight: 500;
          letter-spacing: 0.03em;
        }
      }
    }

    @media (max-width: 992px) {
      .hero-container {
        grid-template-columns: 1fr;
        gap: 2.5rem;
      }
      .benefits-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .promo-card {
        grid-template-columns: 1fr;
      }
      .promo-media {
        min-height: 280px;
      }
      .testimonials-grid {
        grid-template-columns: 1fr;
      }
      .routine-banner {
        flex-direction: column;
        align-items: flex-start;
        gap: 2rem;
      }
    }

    @media (max-width: 600px) {
      .hero-section {
        padding-top: 2rem;
        padding-bottom: 2.5rem;
      }
      .hero-image-frame .hero-img {
        height: clamp(260px, 55vw, 380px);
      }
      .hero-floating-badge {
        bottom: 0.85rem;
        left: 0.85rem;
        padding: 0.65rem 0.85rem;
        max-width: 170px;

        .badge-number {
          font-size: 1.5rem;
        }
        .badge-text {
          font-size: 0.7rem;
        }
      }
      .hero-guarantees {
        flex-direction: column;
        gap: 0.65rem;
      }
      .benefits-grid {
        grid-template-columns: 1fr;
      }
      .promo-content {
        padding: 2rem 1.25rem;
      }
      .routine-banner {
        padding: 2rem 1.25rem;
      }
    }

    @media (max-width: 480px) {
      .hero-actions {
        flex-direction: column;
        width: 100%;
        .btn {
          width: 100%;
        }
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  private readonly productService = inject(ProductService);

  public readonly bestsellers = signal<Product[]>([]);
  public readonly newArrivals = signal<Product[]>([]);
  public readonly categories = signal<Category[]>([]);

  ngOnInit(): void {
    this.productService.getBestsellers().subscribe({
      next: (res) => this.bestsellers.set(res.products)
    });

    this.productService.getNewArrivals().subscribe({
      next: (res) => this.newArrivals.set(res.products)
    });

    this.productService.getCategories().subscribe({
      next: (res) => this.categories.set(res.categories)
    });
  }
}

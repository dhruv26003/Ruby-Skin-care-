import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService, ProductFilterParams } from '../../core/services/product.service';
import { Product, Category } from '../../core/models/product.model';
import { ProductCardComponent } from '../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ProductCardComponent],
  template: `
    <div class="products-page">
      <!-- Page Header -->
      <section class="products-hero">
        <div class="container">
          <span class="hero-sub">THE COMPLETE APOTHECARY</span>
          <h1>Botanical Clinical Skincare</h1>
          <p>Potent botanical extracts, ceramides, and targeted clinical actives formulated to elevate your natural glow.</p>
        </div>
      </section>

      <div class="container main-content-wrap">
        <!-- Mobile Filter Toggle Bar -->
        <div class="mobile-filter-bar">
          <button class="btn btn-secondary btn-sm" (click)="isFilterDrawerOpen.set(true)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
            Filter Products
          </button>
          <span class="product-count-note">{{ totalProducts() }} Products Found</span>
        </div>

        <!-- Backdrop for mobile filter drawer -->
        @if (isFilterDrawerOpen()) {
          <div class="filter-backdrop" (click)="isFilterDrawerOpen.set(false)"></div>
        }

        <div class="catalog-layout">
          <!-- Filter Sidebar (Desktop & Mobile Drawer) -->
          <aside class="filter-sidebar" [class.mobile-open]="isFilterDrawerOpen()">
            <div class="sidebar-header-mobile">
              <h3>Refine Rituals</h3>
              <button class="close-sidebar" (click)="isFilterDrawerOpen.set(false)">✕</button>
            </div>

            <!-- Search Filter -->
            <div class="filter-section">
              <label class="filter-title">Search Formula</label>
              <div class="search-box">
                <input
                  type="text"
                  [(ngModel)]="searchQuery"
                  (keyup.enter)="applyFilters()"
                  placeholder="e.g., Vitamin C, Niacinamide"
                  class="filter-input"
                />
                @if (searchQuery) {
                  <button class="clear-search" (click)="searchQuery = ''; applyFilters()">✕</button>
                }
              </div>
            </div>

            <!-- Categories Filter -->
            <div class="filter-section">
              <label class="filter-title">Category</label>
              <div class="filter-options">
                <button
                  class="filter-chip"
                  [class.active]="selectedCategory() === 'all'"
                  (click)="setCategory('all')"
                >
                  All Categories
                </button>
                @for (cat of categories(); track cat.slug) {
                  <button
                    class="filter-chip"
                    [class.active]="selectedCategory() === cat.slug"
                    (click)="setCategory(cat.slug)"
                  >
                    {{ cat.name }}
                  </button>
                }
              </div>
            </div>

            <!-- Skin Concern Filter -->
            <div class="filter-section">
              <label class="filter-title">Targeted Concern</label>
              <div class="filter-options">
                @for (concern of skinConcerns; track concern) {
                  <button
                    class="filter-chip"
                    [class.active]="selectedConcern() === concern"
                    (click)="setConcern(concern)"
                  >
                    {{ concern }}
                  </button>
                }
              </div>
            </div>

            <!-- Skin Type Filter -->
            <div class="filter-section">
              <label class="filter-title">Skin Type</label>
              <div class="filter-options">
                @for (type of skinTypes; track type) {
                  <button
                    class="filter-chip"
                    [class.active]="selectedSkinType() === type"
                    (click)="setSkinType(type)"
                  >
                    {{ type }}
                  </button>
                }
              </div>
            </div>

            <!-- Price Range Filter -->
            <div class="filter-section">
              <label class="filter-title">Max Price (₹)</label>
              <div class="price-slider-wrap">
                <input
                  type="range"
                  min="500"
                  max="2000"
                  step="50"
                  [(ngModel)]="maxPrice"
                  (change)="applyFilters()"
                  class="range-slider"
                />
                <div class="price-labels">
                  <span>₹500</span>
                  <span class="current-price-val">Up to ₹{{ maxPrice }}</span>
                  <span>₹2000</span>
                </div>
              </div>
            </div>

            <!-- Special Filter: Sale Only -->
            <div class="filter-section">
              <label class="checkbox-label">
                <input
                  type="checkbox"
                  [(ngModel)]="onlySale"
                  (change)="applyFilters()"
                />
                <span>Special Offers Only</span>
              </label>
            </div>

            <button class="btn btn-secondary btn-sm reset-filters-btn" (click)="resetAllFilters()">
              Reset All Filters
            </button>
          </aside>

          <!-- Products Grid & Toolbar Area -->
          <main class="products-main">
            <!-- Toolbar: Active Filters & Sorting -->
            <div class="catalog-toolbar">
              <div class="active-chips">
                @if (selectedCategory() !== 'all') {
                  <span class="active-tag">
                    Category: {{ selectedCategory() }}
                    <button (click)="setCategory('all')">✕</button>
                  </span>
                }
                @if (selectedConcern() !== 'all') {
                  <span class="active-tag">
                    Concern: {{ selectedConcern() }}
                    <button (click)="setConcern('all')">✕</button>
                  </span>
                }
                @if (selectedSkinType() !== 'all') {
                  <span class="active-tag">
                    Skin: {{ selectedSkinType() }}
                    <button (click)="setSkinType('all')">✕</button>
                  </span>
                }
                @if (searchQuery) {
                  <span class="active-tag">
                    "{{ searchQuery }}"
                    <button (click)="searchQuery = ''; applyFilters()">✕</button>
                  </span>
                }
                @if (onlySale) {
                  <span class="active-tag">
                    On Sale
                    <button (click)="onlySale = false; applyFilters()">✕</button>
                  </span>
                }
              </div>

              <div class="sort-dropdown-wrap">
                <label for="sortSelect">Sort By:</label>
                <select id="sortSelect" [(ngModel)]="selectedSort" (change)="applyFilters()" class="sort-select">
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest Formulations</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                </select>
              </div>
            </div>

            <!-- Product Grid -->
            @if (isLoading()) {
              <div class="loading-grid">
                @for (i of [1,2,3,4,5,6]; track i) {
                  <div class="skeleton-card"></div>
                }
              </div>
            } @else if (products().length > 0) {
              <div class="grid-3">
                @for (product of products(); track product.id || product._id) {
                  <app-product-card [product]="product"></app-product-card>
                }
              </div>

              <!-- Pagination -->
              @if (totalPages() > 1) {
                <div class="pagination-wrap">
                  <button
                    class="btn-page"
                    [disabled]="currentPage() === 1"
                    (click)="changePage(currentPage() - 1)"
                  >
                    ← Prev
                  </button>

                  @for (page of getPageArray(); track page) {
                    <button
                      class="btn-page"
                      [class.active]="currentPage() === page"
                      (click)="changePage(page)"
                    >
                      {{ page }}
                    </button>
                  }

                  <button
                    class="btn-page"
                    [disabled]="currentPage() === totalPages()"
                    (click)="changePage(currentPage() + 1)"
                  >
                    Next →
                  </button>
                </div>
              }
            } @else {
              <!-- Empty State -->
              <div class="empty-catalog-state">
                <div class="empty-icon">🌿</div>
                <h3>No Formulations Match Your Criteria</h3>
                <p>Try adjusting your search terms or relaxing category, skin concern, or price filters.</p>
                <button class="btn btn-primary" (click)="resetAllFilters()">Clear All Filters</button>
              </div>
            }
          </main>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .products-hero {
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

      h1 {
        margin-bottom: 0.75rem;
      }

      p {
        max-width: 600px;
        margin: 0 auto;
        font-size: 1.05rem;
      }
    }

    .main-content-wrap {
      padding-top: 2.5rem;
      padding-bottom: 4rem;
    }

    .mobile-filter-bar {
      display: none;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--color-border, #e8e2d8);

      .product-count-note {
        font-size: 0.85rem;
        color: var(--color-muted, #646d68);
      }
    }

    .catalog-layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      gap: 3rem;
      align-items: start;
    }

    /* Filter Sidebar */
    .filter-sidebar {
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      padding: 1.75rem;
      position: sticky;
      top: 90px;

      .sidebar-header-mobile {
        display: none;
      }
    }

    .filter-section {
      margin-bottom: 1.75rem;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid var(--color-border-subtle, #f0ebe2);

      &:last-of-type {
        border-bottom: none;
      }
    }

    .filter-title {
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--color-charcoal, #1c211e);
      margin-bottom: 0.85rem;
      display: block;
    }

    .search-box {
      position: relative;

      .filter-input {
        width: 100%;
        padding: 0.65rem 2rem 0.65rem 0.85rem;
        font-size: 0.85rem;
        border: 1px solid var(--color-border, #e8e2d8);
        border-radius: var(--radius-sm, 8px);
        outline: none;

        &:focus {
          border-color: var(--color-primary, #4e6b5d);
        }
      }

      .clear-search {
        position: absolute;
        right: 0.5rem;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: var(--color-muted, #646d68);
        cursor: pointer;
      }
    }

    .filter-options {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .filter-chip {
      background: var(--color-beige, #f4efe6);
      border: 1px solid transparent;
      color: var(--color-charcoal, #1c211e);
      font-size: 0.775rem;
      font-weight: 500;
      padding: 0.4rem 0.85rem;
      border-radius: var(--radius-full, 9999px);
      cursor: pointer;
      transition: all 0.15s ease;

      &:hover {
        background-color: var(--color-beige-dark, #e8e0d2);
      }

      &.active {
        background-color: var(--color-primary, #4e6b5d);
        color: var(--color-white, #fff);
      }
    }

    .price-slider-wrap {
      .range-slider {
        width: 100%;
        accent-color: var(--color-primary, #4e6b5d);
      }

      .price-labels {
        display: flex;
        justify-content: space-between;
        font-size: 0.75rem;
        color: var(--color-muted, #646d68);
        margin-top: 0.25rem;

        .current-price-val {
          font-weight: 700;
          color: var(--color-primary, #4e6b5d);
        }
      }
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--color-charcoal, #1c211e);
      cursor: pointer;
    }

    .reset-filters-btn {
      width: 100%;
      margin-top: 0.5rem;
    }

    /* Toolbar */
    .catalog-toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .active-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .active-tag {
      background: var(--color-primary-soft, rgba(78, 107, 93, 0.1));
      color: var(--color-primary, #4e6b5d);
      font-size: 0.775rem;
      font-weight: 600;
      padding: 0.3rem 0.75rem;
      border-radius: var(--radius-full, 9999px);
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;

      button {
        background: none;
        border: none;
        cursor: pointer;
        color: inherit;
        font-size: 0.8rem;
        line-height: 1;
      }
    }

    .sort-dropdown-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      margin-left: auto;

      label {
        color: var(--color-muted, #646d68);
      }

      .sort-select {
        padding: 0.45rem 1rem;
        border-radius: var(--radius-sm, 8px);
        border: 1px solid var(--color-border, #e8e2d8);
        background: var(--color-white, #fff);
        color: var(--color-charcoal, #1c211e);
        font-size: 0.85rem;
        outline: none;

        &:focus {
          border-color: var(--color-primary, #4e6b5d);
        }
      }
    }

    /* Skeletons */
    .loading-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 2rem;

      .skeleton-card {
        height: 380px;
        background: #ede8df;
        border-radius: var(--radius-md, 14px);
        animation: pulse 1.5s infinite ease-in-out;
      }
    }

    /* Pagination */
    .pagination-wrap {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.4rem;
      margin-top: 3.5rem;

      .btn-page {
        background: var(--color-white, #fff);
        border: 1px solid var(--color-border, #e8e2d8);
        color: var(--color-charcoal, #1c211e);
        min-width: 38px;
        height: 38px;
        padding: 0 0.5rem;
        border-radius: var(--radius-sm, 8px);
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;

        &:hover:not(:disabled) {
          background-color: var(--color-beige, #f4efe6);
          border-color: var(--color-primary, #4e6b5d);
        }

        &.active {
          background-color: var(--color-primary, #4e6b5d);
          color: var(--color-white, #fff);
          border-color: var(--color-primary, #4e6b5d);
        }

        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }
      }
    }

    /* Empty state */
    .empty-catalog-state {
      text-align: center;
      padding: 4rem 1.5rem;
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);

      .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
      }

      h3 {
        margin-bottom: 0.5rem;
      }

      p {
        max-width: 440px;
        margin: 0 auto 1.5rem auto;
      }
    }

    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 0.9; }
      100% { opacity: 0.6; }
    }

    @media (max-width: 992px) {
      .catalog-layout {
        grid-template-columns: 1fr;
      }
      .mobile-filter-bar {
        display: flex;
      }

      .filter-sidebar {
        display: none;
        position: fixed;
        inset: 0;
        z-index: 2000;
        width: 100%;
        max-width: 320px;
        height: 100vh;
        overflow-y: auto;
        border-radius: 0;
        box-shadow: 4px 0 24px rgba(0, 0, 0, 0.2);

        &.mobile-open {
          display: block;
        }

        .sidebar-header-mobile {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--color-border, #e8e2d8);

          .close-sidebar {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
          }
        }
      }

      .filter-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        backdrop-filter: blur(2px);
        z-index: 1999;
      }

      .catalog-toolbar {
        flex-direction: column;
        align-items: stretch;
        gap: 0.75rem;

        .sort-dropdown-wrap {
          margin-left: 0;
          width: 100%;
          justify-content: space-between;

          .sort-select {
            flex: 1;
          }
        }
      }
    }
  `]
})
export class ProductsComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  public readonly products = signal<Product[]>([]);
  public readonly categories = signal<Category[]>([]);
  public readonly isLoading = signal<boolean>(true);
  public readonly totalProducts = signal<number>(0);
  public readonly totalPages = signal<number>(1);
  public readonly currentPage = signal<number>(1);

  public readonly selectedCategory = signal<string>('all');
  public readonly selectedConcern = signal<string>('all');
  public readonly selectedSkinType = signal<string>('all');
  public searchQuery: string = '';
  public maxPrice: number = 2000;
  public onlySale: boolean = false;
  public selectedSort: string = 'popular';
  public readonly isFilterDrawerOpen = signal<boolean>(false);

  public readonly skinConcerns = [
    'Dark Spots',
    'Acne',
    'Dehydration',
    'Fine Lines',
    'Large Pores',
    'Redness'
  ];

  public readonly skinTypes = [
    'All Skin Types',
    'Sensitive',
    'Oily',
    'Dry',
    'Combination'
  ];

  ngOnInit(): void {
    this.productService.getCategories().subscribe({
      next: (res) => this.categories.set(res.categories)
    });

    this.route.queryParams.subscribe((params) => {
      if (params['category']) this.selectedCategory.set(params['category']);
      if (params['concern']) this.selectedConcern.set(params['concern']);
      if (params['skinType']) this.selectedSkinType.set(params['skinType']);
      if (params['search']) this.searchQuery = params['search'];
      if (params['onSale'] === 'true') this.onlySale = true;
      if (params['sort']) this.selectedSort = params['sort'];
      if (params['page']) this.currentPage.set(parseInt(params['page'], 10) || 1);

      this.fetchProducts();
    });
  }

  public fetchProducts(): void {
    this.isLoading.set(true);

    const filterParams: ProductFilterParams = {
      search: this.searchQuery || undefined,
      category: this.selectedCategory() !== 'all' ? this.selectedCategory() : undefined,
      skinConcern: this.selectedConcern() !== 'all' ? this.selectedConcern() : undefined,
      skinType: this.selectedSkinType() !== 'all' ? this.selectedSkinType() : undefined,
      maxPrice: this.maxPrice < 2000 ? this.maxPrice : undefined,
      onSale: this.onlySale ? true : undefined,
      sort: this.selectedSort,
      page: this.currentPage(),
      limit: 9
    };

    this.productService.getProducts(filterParams).subscribe({
      next: (res) => {
        this.products.set(res.products);
        this.totalProducts.set(res.total);
        this.totalPages.set(res.totalPages);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  public setCategory(cat: string): void {
    this.selectedCategory.set(cat);
    this.currentPage.set(1);
    this.applyFilters();
  }

  public setConcern(concern: string): void {
    this.selectedConcern.set(this.selectedConcern() === concern ? 'all' : concern);
    this.currentPage.set(1);
    this.applyFilters();
  }

  public setSkinType(type: string): void {
    this.selectedSkinType.set(this.selectedSkinType() === type ? 'all' : type);
    this.currentPage.set(1);
    this.applyFilters();
  }

  public applyFilters(): void {
    this.isFilterDrawerOpen.set(false);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        category: this.selectedCategory() !== 'all' ? this.selectedCategory() : null,
        concern: this.selectedConcern() !== 'all' ? this.selectedConcern() : null,
        skinType: this.selectedSkinType() !== 'all' ? this.selectedSkinType() : null,
        search: this.searchQuery.trim() || null,
        onSale: this.onlySale ? 'true' : null,
        sort: this.selectedSort,
        page: this.currentPage() > 1 ? this.currentPage() : null
      },
      queryParamsHandling: 'merge'
    });
  }

  public resetAllFilters(): void {
    this.selectedCategory.set('all');
    this.selectedConcern.set('all');
    this.selectedSkinType.set('all');
    this.searchQuery = '';
    this.maxPrice = 2000;
    this.onlySale = false;
    this.selectedSort = 'popular';
    this.currentPage.set(1);
    this.applyFilters();
  }

  public changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
      this.applyFilters();
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  }

  public getPageArray(): number[] {
    const pages: number[] = [];
    for (let i = 1; i <= this.totalPages(); i++) {
      pages.push(i);
    }
    return pages;
  }
}

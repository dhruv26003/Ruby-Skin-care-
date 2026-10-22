import { Component, inject, signal, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../../core/services/cart.service';
import { WishlistService } from '../../../core/services/wishlist.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    @if (!isAdminRoute()) {
      <!-- 1. Promotional Announcement Bar -->
      <div class="announcement-bar">
      <div class="container announcement-inner">
        <span>🌿 Pure Botanical Rituals: Free Delivery Over ₹999 | Use Code <strong>RUBY10</strong> for 10% Off</span>
      </div>
    </div>

    <!-- 2. Main Navigation Bar -->
    <header class="main-header" [class.scrolled]="isScrolled()">
      <div class="container header-container">
        <!-- Mobile Menu Toggle Button -->
        <button class="mobile-toggle" (click)="toggleMobileMenu()" aria-label="Toggle navigation menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>

        <!-- Brand Logo -->
        <a routerLink="/" class="brand-logo">
          <span class="logo-leaf">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
          </span>
          <span class="logo-text">RUBYCARE</span>
        </a>

        <!-- Desktop Navigation Links -->
        <nav class="desktop-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Home</a>
          <a routerLink="/products" routerLinkActive="active" class="nav-link">Shop Collection</a>
          <a routerLink="/skincare-guide" routerLinkActive="active" class="nav-link">Skincare Guide</a>
          <a routerLink="/about" routerLinkActive="active" class="nav-link">About Us</a>
          <a routerLink="/contact" routerLinkActive="active" class="nav-link">Contact</a>
        </nav>

        <!-- Search Bar -->
        <div class="header-search">
          <form (submit)="onSearch($event)" class="search-form">
            <input
              type="text"
              [(ngModel)]="searchQuery"
              name="search"
              placeholder="Search botanical actives..."
              class="search-input"
            />
            <button type="submit" class="search-submit" aria-label="Search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
        </div>

        <!-- Right Action Icons -->
        <div class="header-actions">
          <!-- Wishlist -->
          <a routerLink="/wishlist" class="action-icon" aria-label="Wishlist">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
            @if (wishlistService.count() > 0) {
              <span class="badge-count">{{ wishlistService.count() }}</span>
            }
          </a>

          <!-- Shopping Cart Bag -->
          <a routerLink="/cart" class="action-icon cart-trigger" aria-label="Shopping Cart">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            @if (cartService.itemCount() > 0) {
              <span class="badge-count">{{ cartService.itemCount() }}</span>
            }
          </a>

          <!-- User Menu Dropdown -->
          <div class="user-menu-wrapper">
            <button
              class="action-icon user-btn"
              (click)="toggleUserMenu($event)"
              aria-label="User account menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>

            @if (isUserMenuOpen()) {
              <div class="user-dropdown" (click)="$event.stopPropagation()">
                @if (authService.isLoggedIn()) {
                  <div class="user-dropdown-header">
                    <span class="user-greeting">Signed in as</span>
                    <strong>{{ authService.currentUser()?.name }}</strong>
                    <span class="user-role-tag">{{ authService.currentUser()?.role | uppercase }}</span>
                  </div>
                  <div class="user-dropdown-links">
                    <a routerLink="/profile" (click)="isUserMenuOpen.set(false)">My Profile</a>
                    <a routerLink="/profile" [queryParams]="{tab: 'orders'}" (click)="isUserMenuOpen.set(false)">Order History</a>
                    @if (authService.isAdmin()) {
                      <a routerLink="/admin" class="admin-link" (click)="isUserMenuOpen.set(false)">Admin Dashboard</a>
                    }
                    <button class="logout-btn" (click)="logout()">Sign Out</button>
                  </div>
                } @else {
                  <div class="user-dropdown-auth">
                    <p class="auth-pitch">Join RubyCare for curated beauty rewards and order tracking.</p>
                    <a routerLink="/login" class="btn btn-primary btn-sm" (click)="isUserMenuOpen.set(false)">Sign In</a>
                    <a routerLink="/register" class="btn btn-secondary btn-sm" (click)="isUserMenuOpen.set(false)">Create Account</a>
                  </div>
                }
              </div>
            }
          </div>
        </div>
      </div>
    </header>

    <!-- Mobile Navigation Drawer (Rendered outside main-header for true viewport-relative fixed positioning) -->
    @if (isMobileMenuOpen()) {
      <div class="mobile-drawer" (click)="closeMobileMenu()" (touchmove)="$event.preventDefault()" (wheel)="$event.preventDefault()">
        <div class="mobile-drawer-content" (click)="$event.stopPropagation()" (touchmove)="$event.stopPropagation()" (wheel)="$event.stopPropagation()">
          <div class="drawer-header">
            <span class="logo-text">RUBYCARE</span>
            <button class="close-drawer" (click)="closeMobileMenu()" aria-label="Close menu">✕</button>
          </div>
          <!-- Mobile Drawer Search -->
          <div class="drawer-search-box">
            <form (submit)="onSearch($event); closeMobileMenu()" class="drawer-search-form">
              <input
                type="text"
                [(ngModel)]="searchQuery"
                name="drawerSearch"
                placeholder="Search botanical actives..."
                class="drawer-search-input"
              />
              <button type="submit" class="drawer-search-btn" aria-label="Search">🔍</button>
            </form>
          </div>
          <nav class="drawer-nav">
            <a routerLink="/" (click)="closeMobileMenu()">Home</a>
            <a routerLink="/products" (click)="closeMobileMenu()">Shop Collection</a>
            <a routerLink="/skincare-guide" (click)="closeMobileMenu()">Skincare Guide</a>
            <a routerLink="/about" (click)="closeMobileMenu()">About Us</a>
            <a routerLink="/contact" (click)="closeMobileMenu()">Contact</a>
            <a routerLink="/wishlist" (click)="closeMobileMenu()">My Saved Wishlist</a>
            <a routerLink="/cart" (click)="closeMobileMenu()">Shopping Cart</a>
            @if (authService.isAdmin()) {
              <a routerLink="/admin" class="admin-drawer-link" (click)="closeMobileMenu()">Admin Dashboard</a>
            }
          </nav>
          <div class="drawer-footer">
            @if (authService.isLoggedIn()) {
              <div class="drawer-user-info">
                <span class="drawer-user-label">Signed in as</span>
                <p class="drawer-user-name">{{ authService.currentUser()?.name }}</p>
              </div>
              <button class="btn btn-secondary btn-sm" (click)="logout(); closeMobileMenu()">Sign Out</button>
            } @else {
              <div class="drawer-auth-buttons">
                <a routerLink="/login" class="btn btn-primary btn-sm" (click)="closeMobileMenu()">Sign In</a>
                <a routerLink="/register" class="btn btn-secondary btn-sm" (click)="closeMobileMenu()">Register</a>
              </div>
            }
          </div>
        </div>
      </div>
    }
  }
  `,
  styles: [`
    .announcement-bar {
      background-color: var(--color-primary-dark, #2f4339);
      color: var(--color-ivory, #faf7f2);
      font-size: 0.775rem;
      letter-spacing: 0.05em;
      text-align: center;
      padding: 0.5rem 1rem;
      font-weight: 400;

      strong {
        color: var(--color-accent-gold-light, #dfcbb0);
        font-weight: 600;
      }
    }

    .main-header {
      background-color: rgba(250, 247, 242, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--color-border, #e8e2d8);
      position: sticky;
      top: 0;
      z-index: 1000;
      transition: all 0.25s ease;

      &.scrolled {
        box-shadow: 0 4px 20px rgba(28, 33, 30, 0.06);
      }
    }

    .header-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 72px;
      gap: 1.5rem;
    }

    .brand-logo {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      text-decoration: none;

      .logo-leaf {
        color: var(--color-primary, #4e6b5d);
        display: flex;
      }

      .logo-text {
        font-family: var(--font-serif, Georgia, serif);
        font-size: 1.45rem;
        letter-spacing: 0.12em;
        font-weight: 600;
        color: var(--color-charcoal, #1c211e);
      }
    }

    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 1.75rem;

      .nav-link {
        font-size: 0.9rem;
        font-weight: 500;
        color: var(--color-charcoal, #1c211e);
        position: relative;
        padding: 0.4rem 0;

        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: var(--color-primary, #4e6b5d);
          transition: width 0.2s ease;
        }

        &:hover::after, &.active::after {
          width: 100%;
        }

        &.active {
          color: var(--color-primary, #4e6b5d);
        }
      }

      .admin-pill {
        background-color: var(--color-primary-soft, rgba(78, 107, 93, 0.1));
        color: var(--color-primary, #4e6b5d);
        padding: 0.35rem 0.85rem;
        border-radius: var(--radius-full, 9999px);
        font-size: 0.8rem;
        font-weight: 600;
        &::after { display: none; }
        &:hover {
          background-color: var(--color-primary, #4e6b5d);
          color: var(--color-white, #fff);
        }
      }
    }

    .header-search {
      flex: 1;
      max-width: 280px;

      .search-form {
        position: relative;
        display: flex;
        align-items: center;
      }

      .search-input {
        width: 100%;
        background-color: var(--color-white, #fff);
        border: 1px solid var(--color-border, #e8e2d8);
        border-radius: var(--radius-full, 9999px);
        padding: 0.5rem 2.25rem 0.5rem 1rem;
        font-size: 0.825rem;
        color: var(--color-charcoal, #1c211e);
        outline: none;
        transition: all 0.2s;

        &:focus {
          border-color: var(--color-primary, #4e6b5d);
          box-shadow: 0 0 0 2px var(--color-primary-soft, rgba(78, 107, 93, 0.1));
        }
      }

      .search-submit {
        position: absolute;
        right: 0.75rem;
        background: none;
        border: none;
        color: var(--color-muted, #646d68);
        cursor: pointer;
        display: flex;
        align-items: center;

        &:hover {
          color: var(--color-primary, #4e6b5d);
        }
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .action-icon {
      position: relative;
      background: none;
      border: none;
      color: var(--color-charcoal, #1c211e);
      cursor: pointer;
      padding: 0.4rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--radius-full, 9999px);
      transition: all 0.2s;

      &:hover {
        background-color: var(--color-beige, #f4efe6);
        color: var(--color-primary, #4e6b5d);
      }

      .badge-count {
        position: absolute;
        top: 0;
        right: 0;
        background-color: var(--color-primary, #4e6b5d);
        color: var(--color-white, #fff);
        font-size: 0.65rem;
        font-weight: 700;
        width: 17px;
        height: 17px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .user-menu-wrapper {
      position: relative;
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 0.5rem);
      right: 0;
      width: 250px;
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      box-shadow: 0 15px 35px rgba(28, 33, 30, 0.12);
      padding: 1.15rem;
      z-index: 100;
      animation: fadeIn 0.2s ease;

      &::before {
        content: '';
        position: absolute;
        top: -14px;
        left: 0;
        right: 0;
        height: 14px;
        background: transparent;
      }
    }

    .user-dropdown-header {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
      border-bottom: 1px solid var(--color-border-subtle, #f0ebe2);
      padding-bottom: 0.75rem;
      margin-bottom: 0.75rem;

      .user-greeting {
        font-size: 0.75rem;
        color: var(--color-muted, #646d68);
      }

      .user-role-tag {
        align-self: flex-start;
        font-size: 0.65rem;
        padding: 0.15rem 0.5rem;
        background-color: var(--color-primary-soft, rgba(78, 107, 93, 0.1));
        color: var(--color-primary, #4e6b5d);
        font-weight: 700;
        border-radius: var(--radius-full, 9999px);
        margin-top: 0.25rem;
      }
    }

    .user-dropdown-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      a {
        font-size: 0.875rem;
        padding: 0.4rem 0.5rem;
        border-radius: var(--radius-xs, 4px);
        color: var(--color-charcoal, #1c211e);
        &:hover {
          background-color: var(--color-beige, #f4efe6);
          color: var(--color-primary, #4e6b5d);
        }
      }

      .admin-link {
        font-weight: 600;
        color: var(--color-primary, #4e6b5d);
      }

      .logout-btn {
        background: none;
        border: none;
        text-align: left;
        font-size: 0.875rem;
        padding: 0.4rem 0.5rem;
        color: var(--color-error, #c94a4a);
        cursor: pointer;
        border-radius: var(--radius-xs, 4px);

        &:hover {
          background-color: #fdf0f0;
        }
      }
    }

    .user-dropdown-auth {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      .auth-pitch {
        font-size: 0.8rem;
        color: var(--color-muted, #646d68);
        line-height: 1.4;
      }
    }

    .mobile-toggle {
      display: none;
      background: none;
      border: none;
      color: var(--color-charcoal, #1c211e);
      cursor: pointer;
    }

    /* Responsive Mobile Styles */
    @media (max-width: 992px) {
      .desktop-nav { display: none; }
      .header-search { display: none; }
      .mobile-toggle { display: block; }
    }

    @media (max-width: 600px) {
      .announcement-bar {
        font-size: 0.72rem;
        padding: 0.35rem 0.65rem;
        line-height: 1.35;
      }
      .main-header {
        .header-container {
          padding-left: 0.85rem;
          padding-right: 0.85rem;
        }
      }
      .brand-logo {
        .logo-text { font-size: 1.15rem; letter-spacing: 0.08em; }
        .logo-leaf svg { width: 19px; height: 19px; }
      }
      .header-actions {
        gap: 0.35rem;
        .action-icon {
          width: 34px;
          height: 34px;
          svg { width: 19px; height: 19px; }
        }
        .badge-count {
          width: 16px;
          height: 16px;
          font-size: 0.6rem;
        }
      }
    }

    .drawer-search-box {
      margin-bottom: 1.5rem;
      .drawer-search-form {
        display: flex;
        align-items: center;
        background: #ffffff;
        border: 1px solid var(--color-border, #e8e2d8);
        border-radius: var(--radius-full, 9999px);
        padding: 0.35rem 0.75rem;

        .drawer-search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 0.85rem;
          outline: none;
          color: var(--color-charcoal, #1c211e);
        }

        .drawer-search-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
        }
      }
    }

    .mobile-drawer {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100vw;
      height: 100vh;
      height: 100dvh;
      background: rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(4px);
      z-index: 99999;
      animation: fadeIn 0.2s ease;
      touch-action: none;
    }

    .mobile-drawer-content {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      width: 82%;
      max-width: 330px;
      height: 100vh;
      height: 100dvh;
      background: var(--color-ivory, #faf7f2);
      padding: 1.5rem 1.25rem;
      display: flex;
      flex-direction: column;
      animation: slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 6px 0 30px rgba(0, 0, 0, 0.25);
      overflow-y: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-y;
    }

    .drawer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--color-border, #e8e2d8);
    }

    .close-drawer {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--color-charcoal, #1c211e);
      padding: 0.25rem;
      line-height: 1;
    }

    .drawer-nav {
      display: flex;
      flex-direction: column;
      gap: 1.15rem;
      margin-bottom: 1.5rem;

      a {
        font-size: 1.05rem;
        font-weight: 500;
        color: var(--color-charcoal, #1c211e);
        transition: color 0.15s;

        &:hover, &:active {
          color: var(--color-primary, #4e6b5d);
        }
      }

      .admin-drawer-link {
        color: var(--color-primary, #4e6b5d);
        font-weight: 600;
      }
    }

    .drawer-footer {
      margin-top: auto;
      padding-top: 1.25rem;
      border-top: 1px solid var(--color-border, #e8e2d8);

      .drawer-user-info {
        margin-bottom: 0.85rem;

        .drawer-user-label {
          font-size: 0.72rem;
          color: var(--color-muted, #646d68);
          display: block;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .drawer-user-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-charcoal, #1c211e);
          margin: 0.15rem 0 0 0;
        }
      }

      .drawer-auth-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes slideRight {
      from { transform: translateX(-100%); }
      to { transform: translateX(0); }
    }
  `]
})
export class HeaderComponent implements OnDestroy {
  public readonly authService = inject(AuthService);
  public readonly cartService = inject(CartService);
  public readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);

  public readonly isScrolled = signal(false);
  public readonly isMobileMenuOpen = signal(false);
  public readonly isUserMenuOpen = signal(false);
  public searchQuery: string = '';
  private savedScrollY = 0;

  constructor() {
    this.router.events.subscribe(() => {
      this.closeMobileMenu();
      this.isUserMenuOpen.set(false);
    });
  }

  private lockScroll(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    document.body.classList.add('menu-open');
    document.documentElement.classList.add('menu-open');
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    document.body.style.touchAction = 'none';
  }

  private unlockScroll(): void {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;
    document.body.classList.remove('menu-open');
    document.documentElement.classList.remove('menu-open');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
    document.body.style.touchAction = '';
  }

  public closeMobileMenu(): void {
    if (this.isMobileMenuOpen()) {
      this.isMobileMenuOpen.set(false);
      this.unlockScroll();
    }
  }

  public toggleMobileMenu(): void {
    const next = !this.isMobileMenuOpen();
    this.isMobileMenuOpen.set(next);
    if (next) {
      this.lockScroll();
    } else {
      this.unlockScroll();
    }
  }

  @HostListener('window:touchmove', ['$event'])
  public onWindowTouchMove(e: TouchEvent): void {
    if (this.isMobileMenuOpen()) {
      const target = e.target as HTMLElement;
      if (!target.closest('.mobile-drawer-content')) {
        e.preventDefault();
      }
    }
  }

  @HostListener('window:wheel', ['$event'])
  public onWindowWheel(e: WheelEvent): void {
    if (this.isMobileMenuOpen()) {
      const target = e.target as HTMLElement;
      if (!target.closest('.mobile-drawer-content')) {
        e.preventDefault();
      }
    }
  }

  public onSearch(e: Event): void {
    e.preventDefault();
    if (this.searchQuery.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { search: this.searchQuery.trim() }
      });
      this.searchQuery = '';
      this.closeMobileMenu();
    }
  }

  public toggleUserMenu(e: Event): void {
    e.stopPropagation();
    this.isUserMenuOpen.update((v) => !v);
  }

  @HostListener('document:click', ['$event'])
  public onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.user-menu-wrapper')) {
      this.isUserMenuOpen.set(false);
    }
  }

  @HostListener('window:scroll')
  public onWindowScroll(): void {
    if (typeof window !== 'undefined') {
      this.isScrolled.set(window.scrollY > 20);
      if (this.isUserMenuOpen()) {
        this.isUserMenuOpen.set(false);
      }
    }
  }

  public logout(): void {
    this.authService.logout();
    this.isUserMenuOpen.set(false);
    this.closeMobileMenu();
    this.router.navigate(['/']);
  }

  public isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin') || (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'));
  }

  ngOnDestroy(): void {
    this.closeMobileMenu();
  }
}

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../../core/services/review-contact.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    @if (!isAdminRoute()) {
      <footer class="site-footer">
      <!-- Newsletter Row -->
      <div class="footer-newsletter">
        <div class="container newsletter-inner">
          <div class="newsletter-text">
            <span class="sub-heading">THE RUBY JOURNAL</span>
            <h3>Cultivate Your Skin's Radiance</h3>
            <p>Join our newsletter community for botanical ingredient guides, seasonal routine advice, and 10% off your first ritual.</p>
          </div>
          <form (submit)="onSubscribe($event)" class="newsletter-form">
            <input
              type="email"
              [(ngModel)]="newsletterEmail"
              name="email"
              placeholder="Enter your email address"
              required
              class="newsletter-input"
            />
            <button type="submit" class="btn btn-primary" [disabled]="isSubscribing">
              {{ isSubscribing ? 'Joining...' : 'Subscribe' }}
            </button>
          </form>
        </div>
      </div>

      <!-- Main Footer Grid -->
      <div class="container footer-main">
        <div class="footer-grid">
          <!-- Column 1: Brand Info -->
          <div class="footer-col brand-col">
            <div class="brand-logo">
              <span class="logo-leaf">🌿</span>
              <span class="logo-text">RUBYCARE</span>
            </div>
            <p class="brand-desc">
              Pure botanical clinical formulations engineered for harmonized, radiant skin. Grounded in dermatological science, formulated with ethical integrity.
            </p>
            <div class="social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener" class="social-icon" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href="https://pinterest.com" target="_blank" rel="noopener" class="social-icon" aria-label="Pinterest">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 0 0-3.66 19.31c-.08-.75-.15-1.9.03-2.72l1.16-4.9s-.3-.6-.3-1.48c0-1.39.8-2.43 1.8-2.43.85 0 1.26.64 1.26 1.4 0 .86-.55 2.14-.83 3.33-.24 1 .5 1.82 1.48 1.82 1.78 0 3.15-1.88 3.15-4.6 0-2.4-1.73-4.08-4.2-4.08-2.86 0-4.54 2.15-4.54 4.37 0 .87.33 1.8.75 2.31a.3.3 0 0 1 .07.28l-.28 1.13c-.04.18-.16.22-.36.13-1.35-.63-2.2-2.6-2.2-4.18 0-3.4 2.47-6.53 7.14-6.53 3.75 0 6.66 2.67 6.66 6.24 0 3.72-2.35 6.72-5.61 6.72-1.1 0-2.13-.57-2.48-1.24l-.68 2.58c-.24.95-.9 2.14-1.34 2.87A10 10 0 1 0 12 2z"></path></svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener" class="social-icon" aria-label="TikTok">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path></svg>
              </a>
            </div>
          </div>

          <!-- Column 2: Shop Collection -->
          <div class="footer-col">
            <h4 class="footer-heading">Shop Rituals</h4>
            <ul class="footer-links">
              <li><a routerLink="/products">All Products</a></li>
              <li><a routerLink="/products" [queryParams]="{category: 'serums'}">Serums & Ampoules</a></li>
              <li><a routerLink="/products" [queryParams]="{category: 'moisturizers'}">Barrier Creams</a></li>
              <li><a routerLink="/products" [queryParams]="{category: 'cleansers'}">Gentle Cleansers</a></li>
              <li><a routerLink="/products" [queryParams]="{category: 'sunscreens'}">Mineral SPF Protection</a></li>
              <li><a routerLink="/products" [queryParams]="{onSale: 'true'}">Special Offers</a></li>
            </ul>
          </div>

          <!-- Column 3: Skin Education -->
          <div class="footer-col">
            <h4 class="footer-heading">Skin Science</h4>
            <ul class="footer-links">
              <li><a routerLink="/skincare-guide">Morning & Evening Routines</a></li>
              <li><a routerLink="/skincare-guide" fragment="ingredients">Active Ingredients Directory</a></li>
              <li><a routerLink="/skincare-guide" fragment="skintypes">Know Your Skin Type</a></li>
              <li><a routerLink="/about">Botanical Purity Promise</a></li>
              <li><a routerLink="/contact">Consult an Esthetician</a></li>
            </ul>
          </div>

          <!-- Column 4: Customer Care & Demo -->
          <div class="footer-col">
            <h4 class="footer-heading">Client Services</h4>
            <ul class="footer-links">
              <li><a routerLink="/profile" [queryParams]="{tab: 'orders'}">Track Order Status</a></li>
              <li><a routerLink="/wishlist">Saved Favorites</a></li>
              <li><a routerLink="/contact">Contact Support</a></li>
              <li><a routerLink="/login">Client Sign In</a></li>
              <li><a routerLink="/admin">Admin Portal</a></li>
            </ul>
            <div class="demo-badge">
              <span>Demo Card / Cash On Delivery Mode Enabled</span>
            </div>
          </div>
        </div>

        <!-- Academic Project Banner & Copyright -->
        <div class="footer-bottom">
          <div class="academic-note">
            <p>
              🎓 <strong>Final Year Academic Demonstration Project:</strong> RubyCare is built with Angular 21, TypeScript, SCSS, Node.js, Express, and MongoDB. Not affiliated with real commercial retail operations.
            </p>
          </div>
          <div class="bottom-bar">
            <p>© {{ currentYear }} RubyCare Skincare. All rights reserved.</p>
            <div class="bottom-links">
              <a routerLink="/about">Privacy Policy</a>
              <span>•</span>
              <a routerLink="/about">Terms of Service</a>
              <span>•</span>
              <a routerLink="/contact">Accessibility</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  }
  `,
  styles: [`
    .site-footer {
      background-color: var(--color-beige, #f4efe6);
      border-top: 1px solid var(--color-border, #e8e2d8);
      margin-top: 4rem;
    }

    .footer-newsletter {
      background-color: var(--color-primary-dark, #2f4339);
      color: var(--color-white, #fff);
      padding: 3.5rem 0;

      .newsletter-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 2.5rem;
        flex-wrap: wrap;
      }

      .newsletter-text {
        max-width: 520px;

        .sub-heading {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          color: var(--color-accent-gold, #c6a779);
          font-weight: 700;
          display: block;
          margin-bottom: 0.35rem;
        }

        h3 {
          color: var(--color-white, #fff);
          margin-bottom: 0.5rem;
        }

        p {
          color: #b7c2bc;
          font-size: 0.95rem;
        }
      }

      .newsletter-form {
        display: flex;
        gap: 0.75rem;
        width: 100%;
        max-width: 440px;

        .newsletter-input {
          flex: 1;
          padding: 0.85rem 1.25rem;
          border-radius: var(--radius-full, 9999px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
          color: var(--color-white, #fff);
          font-size: 0.9rem;
          outline: none;

          &::placeholder {
            color: rgba(255, 255, 255, 0.6);
          }

          &:focus {
            border-color: var(--color-accent-gold, #c6a779);
            background: rgba(255, 255, 255, 0.15);
          }
        }
      }
    }

    .footer-main {
      padding-top: 4rem;
      padding-bottom: 2.5rem;
    }

    .footer-grid {
      display: grid;
      grid-template-columns: 1.5fr 1fr 1fr 1.2fr;
      gap: 3rem;
      margin-bottom: 3.5rem;
    }

    .brand-col {
      .brand-logo {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: var(--font-serif, Georgia, serif);
        font-size: 1.4rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        margin-bottom: 1rem;
        color: var(--color-charcoal, #1c211e);
      }

      .brand-desc {
        font-size: 0.875rem;
        line-height: 1.7;
        margin-bottom: 1.5rem;
      }

      .social-links {
        display: flex;
        gap: 0.75rem;

        .social-icon {
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 1px solid var(--color-border, #e8e2d8);
          background-color: var(--color-white, #fff);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-charcoal, #1c211e);
          transition: all 0.2s;

          &:hover {
            background-color: var(--color-primary, #4e6b5d);
            color: var(--color-white, #fff);
            border-color: var(--color-primary, #4e6b5d);
          }
        }
      }
    }

    .footer-heading {
      font-size: 1.05rem;
      margin-bottom: 1.25rem;
      color: var(--color-charcoal, #1c211e);
      font-family: var(--font-serif, Georgia, serif);
    }

    .footer-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;

      a {
        font-size: 0.875rem;
        color: var(--color-muted, #646d68);
        transition: color 0.2s;

        &:hover {
          color: var(--color-primary, #4e6b5d);
          padding-left: 4px;
        }
      }
    }

    .demo-badge {
      margin-top: 1.25rem;
      display: inline-block;
      padding: 0.4rem 0.75rem;
      background: var(--color-white, #fff);
      border: 1px dashed var(--color-accent-gold, #c6a779);
      border-radius: var(--radius-sm, 8px);
      font-size: 0.75rem;
      color: #8c6a38;
      font-weight: 500;
    }

    .footer-bottom {
      border-top: 1px solid var(--color-border, #e8e2d8);
      padding-top: 2rem;

      .academic-note {
        background-color: rgba(78, 107, 93, 0.08);
        border: 1px solid rgba(78, 107, 93, 0.2);
        border-radius: var(--radius-sm, 8px);
        padding: 0.85rem 1.25rem;
        margin-bottom: 1.5rem;
        font-size: 0.825rem;
        color: var(--color-primary-dark, #2f4339);
        text-align: center;
      }

      .bottom-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 1rem;
        font-size: 0.825rem;
        color: var(--color-muted, #646d68);

        .bottom-links {
          display: flex;
          align-items: center;
          gap: 0.75rem;

          a:hover {
            color: var(--color-primary, #4e6b5d);
          }
        }
      }
    }

    @media (max-width: 992px) {
      .footer-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 2.5rem;
      }
    }

    @media (max-width: 600px) {
      .footer-newsletter {
        padding: 2.5rem 0;

        .newsletter-inner {
          flex-direction: column;
          align-items: flex-start;
          gap: 1.5rem;
        }

        .newsletter-form {
          width: 100%;
          max-width: 100%;
          flex-direction: column;
          gap: 0.65rem;

          .btn { width: 100%; }
        }
      }

      .footer-main {
        padding-top: 2.5rem;
        padding-bottom: 2rem;
      }

      .footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }

      .bottom-bar {
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 0.85rem;
      }
    }
  `]
})
export class FooterComponent {
  private readonly contactService = inject(ContactService);
  private readonly toast = inject(ToastService);

  public newsletterEmail: string = '';
  public isSubscribing: boolean = false;
  public readonly currentYear = new Date().getFullYear();
  private readonly router = inject(Router);

  public isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin') || (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin'));
  }

  public onSubscribe(e: Event): void {
    e.preventDefault();
    if (!this.newsletterEmail) return;

    this.isSubscribing = true;
    this.contactService.subscribeNewsletter(this.newsletterEmail).subscribe({
      next: (res) => {
        this.toast.success(res.message);
        this.newsletterEmail = '';
        this.isSubscribing = false;
      },
      error: () => {
        this.toast.error('Subscription could not be processed. Please try again.');
        this.isSubscribing = false;
      }
    });
  }
}

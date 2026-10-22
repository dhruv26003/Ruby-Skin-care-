import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-page">
      <div class="container not-found-content">
        <span class="error-code">404</span>
        <span class="leaf-icon">🌿</span>
        <h1>Page Not Discovered</h1>
        <p>The ritual or page you are seeking might have been reformulated or moved to our apothecary archives.</p>
        <div class="actions">
          <a routerLink="/" class="btn btn-primary btn-lg">Return Home</a>
          <a routerLink="/products" class="btn btn-secondary btn-lg">Explore Shop</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-page {
      min-height: 70vh;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 4rem 1.5rem;
    }

    .not-found-content {
      max-width: 520px;

      .error-code {
        font-family: var(--font-serif, Georgia, serif);
        font-size: 5rem;
        font-weight: 700;
        color: var(--color-accent-gold, #c6a779);
        display: block;
        line-height: 1;
      }

      .leaf-icon {
        font-size: 2.5rem;
        display: block;
        margin: 0.5rem 0 1rem 0;
      }

      h1 { margin-bottom: 0.75rem; font-size: 2rem; }
      p { margin-bottom: 2rem; font-size: 1.05rem; }

      .actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
      }
    }
  `]
})
export class NotFoundComponent {}

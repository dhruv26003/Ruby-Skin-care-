import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stars-container" [attr.aria-label]="'Rating: ' + rating + ' out of 5 stars'">
      @for (star of [1, 2, 3, 4, 5]; track star) {
        <svg
          class="star-icon"
          [class.filled]="rating >= star"
          [class.half]="rating >= star - 0.5 && rating < star"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.8"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      }
      @if (showNumber) {
        <span class="rating-number">{{ rating.toFixed(1) }}</span>
      }
      @if (reviewCount !== undefined) {
        <span class="review-count">({{ reviewCount }})</span>
      }
    </div>
  `,
  styles: [`
    .stars-container {
      display: inline-flex;
      align-items: center;
      gap: 0.2rem;
    }

    .star-icon {
      color: #dfd8cb;
      transition: color 0.15s;

      &.filled {
        color: #d4a359;
        fill: #d4a359;
      }

      &.half {
        color: #d4a359;
        fill: url(#halfGradient);
      }
    }

    .rating-number {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-charcoal, #1c211e);
      margin-left: 0.25rem;
    }

    .review-count {
      font-size: 0.8rem;
      color: var(--color-muted, #646d68);
      margin-left: 0.15rem;
    }
  `]
})
export class RatingStarsComponent {
  @Input() rating: number = 5;
  @Input() reviewCount?: number;
  @Input() showNumber: boolean = false;
}

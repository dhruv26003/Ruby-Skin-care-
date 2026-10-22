import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="toast-item" [ngClass]="toast.type">
          <div class="toast-icon">
            @if (toast.type === 'success') {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            } @else if (toast.type === 'error') {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            } @else {
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            }
          </div>
          <div class="toast-message">{{ toast.message }}</div>
          <button class="toast-close" (click)="toastService.remove(toast.id)" aria-label="Close notification">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 380px;
      pointer-events: none;
    }

    .toast-item {
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.9rem 1.15rem;
      border-radius: var(--radius-md, 14px);
      background: var(--color-white, #fff);
      box-shadow: 0 10px 30px rgba(28, 33, 30, 0.15);
      border: 1px solid var(--color-border, #e8e2d8);
      font-size: 0.875rem;
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;

      &.success {
        border-left: 4px solid var(--color-primary, #4e6b5d);
        .toast-icon { color: var(--color-primary, #4e6b5d); }
      }
      &.error {
        border-left: 4px solid var(--color-error, #c94a4a);
        .toast-icon { color: var(--color-error, #c94a4a); }
      }
      &.info {
        border-left: 4px solid var(--color-accent-gold, #c6a779);
        .toast-icon { color: var(--color-accent-gold, #c6a779); }
      }
    }

    .toast-message {
      flex: 1;
      color: var(--color-charcoal, #1c211e);
      font-weight: 500;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--color-muted, #646d68);
      padding: 0.2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.15s;

      &:hover {
        color: var(--color-charcoal, #1c211e);
      }
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `]
})
export class ToastComponent {
  public readonly toastService = inject(ToastService);
}

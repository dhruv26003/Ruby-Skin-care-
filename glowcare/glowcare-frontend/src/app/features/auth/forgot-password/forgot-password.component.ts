import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="auth-page">
      <div class="container auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <span class="auth-leaf">🔐</span>
            <h1>Reset Your Password</h1>
            <p>Enter the email address tied to your RubyCare account and we will simulate your password reset instructions.</p>
          </div>

          <!-- Academic Demo Notice -->
          <div class="demo-box">
            <strong>Demonstration Environment Notice:</strong>
            <p>In this academic prototype, live SMTP email servers are simulated. You can test authentication using the preconfigured demo accounts:</p>
            <ul>
              <li><strong>Admin:</strong> admin&#64;rubycare.com (Password: Admin&#64;123)</li>
              <li><strong>Customer:</strong> customer&#64;rubycare.com (Password: Customer&#64;123)</li>
            </ul>
          </div>

          <form (submit)="onSubmit($event)" class="auth-form">
            <div class="form-group">
              <label class="form-label" for="resetEmail">Registered Email</label>
              <input
                id="resetEmail"
                type="email"
                [(ngModel)]="email"
                name="email"
                required
                class="form-control"
                placeholder="name@example.com"
              />
            </div>

            <button type="submit" class="btn btn-primary btn-lg auth-submit-btn" [disabled]="isLoading || !email">
              {{ isLoading ? 'Dispatching...' : 'Request Reset Link' }}
            </button>
          </form>

          <div class="auth-footer">
            <p>Remember your password? <a routerLink="/login">Back to Sign In</a></p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 80vh;
      display: flex;
      align-items: center;
      padding: 3rem 0;
      background: linear-gradient(180deg, var(--color-ivory, #faf7f2) 0%, var(--color-beige, #f4efe6) 100%);
    }

    .auth-container { max-width: 520px; }

    .auth-card {
      background: var(--color-white, #fff);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-xl, 30px);
      padding: clamp(2rem, 5vw, 3rem);
      box-shadow: 0 15px 40px rgba(28, 33, 30, 0.06);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 1.5rem;

      .auth-leaf {
        font-size: 2.2rem;
        display: block;
        margin-bottom: 0.5rem;
      }

      h1 { font-size: 1.85rem; margin-bottom: 0.5rem; }
      p { font-size: 0.9rem; line-height: 1.5; }
    }

    .demo-box {
      background: var(--color-beige, #f4efe6);
      border: 1px solid var(--color-border, #e8e2d8);
      border-radius: var(--radius-md, 14px);
      padding: 1.25rem;
      font-size: 0.825rem;
      margin-bottom: 1.5rem;

      strong { color: var(--color-primary-dark, #2f4339); display: block; margin-bottom: 0.25rem; }
      p { margin-bottom: 0.5rem; color: var(--color-charcoal, #1c211e); }

      ul {
        margin-left: 1.25rem;
        color: var(--color-muted, #646d68);
        li { margin-bottom: 0.2rem; }
      }
    }

    .auth-submit-btn {
      width: 100%;
      margin-top: 1rem;
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--color-border, #e8e2d8);
      font-size: 0.875rem;

      a {
        color: var(--color-primary, #4e6b5d);
        font-weight: 600;
      }
    }
  `]
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);

  public email: string = '';
  public isLoading: boolean = false;

  public onSubmit(e: Event): void {
    e.preventDefault();
    if (!this.email) return;

    this.isLoading = true;
    this.authService.forgotPassword(this.email).subscribe({
      next: () => {
        this.isLoading = false;
        this.email = '';
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}

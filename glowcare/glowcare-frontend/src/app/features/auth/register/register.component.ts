import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth-page">
      <div class="container auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <span class="auth-leaf">🌿</span>
            <h1>Join RubyCare</h1>
            <p>Begin your conscious skincare journey with tailored ritual guidance and exclusive member privileges.</p>
          </div>

          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label class="form-label" for="regName">Full Name *</label>
              <input
                id="regName"
                type="text"
                formControlName="name"
                class="form-control"
                placeholder="Jane Doe"
              />
              @if (f['name'].touched && f['name'].invalid) {
                <span class="form-error">Please provide your full name.</span>
              }
            </div>

            <div class="form-group">
              <label class="form-label" for="regEmail">Email Address *</label>
              <input
                id="regEmail"
                type="email"
                formControlName="email"
                class="form-control"
                placeholder="jane@example.com"
              />
              @if (f['email'].touched && f['email'].invalid) {
                <span class="form-error">Please enter a valid email address.</span>
              }
            </div>

            <div class="form-group">
              <label class="form-label" for="regPhone">Phone Number</label>
              <input
                id="regPhone"
                type="tel"
                formControlName="phone"
                class="form-control"
                placeholder="+1 (555) 019-2834"
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="regPass">Create Password *</label>
              <input
                id="regPass"
                type="password"
                formControlName="password"
                class="form-control"
                placeholder="At least 6 characters"
              />
              @if (f['password'].touched && f['password'].invalid) {
                <span class="form-error">Password must be at least 6 characters long.</span>
              }
            </div>

            <button type="submit" class="btn btn-primary btn-lg auth-submit-btn" [disabled]="isLoading || registerForm.invalid">
              {{ isLoading ? 'Creating Account...' : 'Complete Registration' }}
            </button>
          </form>

          <div class="auth-footer">
            <p>Already have an account? <a routerLink="/login">Sign In</a></p>
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
      margin-bottom: 2rem;

      .auth-leaf {
        font-size: 2.2rem;
        display: block;
        margin-bottom: 0.5rem;
      }

      h1 { font-size: 1.85rem; margin-bottom: 0.5rem; }
      p { font-size: 0.9rem; line-height: 1.5; }
    }

    .auth-submit-btn {
      width: 100%;
      margin-top: 1.25rem;
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
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public isLoading: boolean = false;

  public registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  get f() {
    return this.registerForm.controls;
  }

  public onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/profile']);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}

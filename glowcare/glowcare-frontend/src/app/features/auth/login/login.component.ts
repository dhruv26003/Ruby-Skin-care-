import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  template: `
    <div class="auth-page">
      <div class="container auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <span class="auth-leaf">🌿</span>
            <h1>Welcome Back</h1>
            <p>Sign in to access your saved skincare rituals, track delivery, and unlock member rewards.</p>
          </div>

          <!-- Demo Quick Fill Assist Bar -->
          <div class="demo-fill-box">
            <span class="demo-tag">DEMO MODE ONE-CLICK FILL:</span>
            <div class="demo-buttons">
              <button type="button" class="btn-demo-pill" (click)="fillAdmin()">
                🔑 Admin Demo (admin&#64;rubycare.com)
              </button>
              <button type="button" class="btn-demo-pill" (click)="fillManager()">
                🛡️ Manager Demo (manager&#64;rubycare.com)
              </button>
              <button type="button" class="btn-demo-pill" (click)="fillCustomer()">
                👤 Customer Demo (customer&#64;rubycare.com)
              </button>
            </div>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
            <div class="form-group">
              <label class="form-label" for="loginEmail">Email Address</label>
              <input
                id="loginEmail"
                type="email"
                formControlName="email"
                class="form-control"
                placeholder="name@example.com"
              />
              @if (f['email'].touched && f['email'].invalid) {
                <span class="form-error">Please enter a valid email address.</span>
              }
            </div>

            <div class="form-group">
              <div class="password-label-row">
                <label class="form-label" for="loginPass">Password</label>
                <a routerLink="/forgot-password" class="forgot-link">Forgot password?</a>
              </div>
              <input
                id="loginPass"
                type="password"
                formControlName="password"
                class="form-control"
                placeholder="••••••••"
              />
              @if (f['password'].touched && f['password'].invalid) {
                <span class="form-error">Password must be at least 6 characters.</span>
              }
            </div>

            <button type="submit" class="btn btn-primary btn-lg auth-submit-btn" [disabled]="isLoading || loginForm.invalid">
              {{ isLoading ? 'Signing In...' : 'Sign In to RubyCare' }}
            </button>
          </form>

          <div class="auth-footer">
            <p>Do not have an account yet? <a routerLink="/register">Create an account</a></p>
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

    .auth-container {
      max-width: 500px;
    }

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

    .demo-fill-box {
      background: var(--color-beige, #f4efe6);
      border: 1px dashed var(--color-accent-gold, #c6a779);
      border-radius: var(--radius-sm, 8px);
      padding: 0.85rem;
      margin-bottom: 1.75rem;

      .demo-tag {
        font-size: 0.7rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        color: #8c6a38;
        display: block;
        margin-bottom: 0.4rem;
      }

      .demo-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;

        .btn-demo-pill {
          background: var(--color-white, #fff);
          border: 1px solid var(--color-border, #e8e2d8);
          border-radius: var(--radius-xs, 4px);
          font-size: 0.775rem;
          padding: 0.35rem 0.65rem;
          text-align: left;
          cursor: pointer;
          color: var(--color-charcoal, #1c211e);
          transition: all 0.15s;

          &:hover {
            background: var(--color-primary-soft, rgba(78, 107, 93, 0.1));
            border-color: var(--color-primary, #4e6b5d);
          }
        }
      }
    }

    .password-label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .forgot-link {
        font-size: 0.75rem;
        color: var(--color-primary, #4e6b5d);
        text-decoration: underline;
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
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  public isLoading: boolean = false;
  private returnUrl: string = '/';

  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

  public fillAdmin(): void {
    this.loginForm.patchValue({
      email: 'admin@rubycare.com',
      password: 'Admin@123'
    });
  }

  public fillManager(): void {
    this.loginForm.patchValue({
      email: 'manager@rubycare.com',
      password: 'Admin@123'
    });
  }

  public fillCustomer(): void {
    this.loginForm.patchValue({
      email: 'customer@rubycare.com',
      password: 'Customer@123'
    });
  }

  public onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.user.role === 'admin') {
          this.router.navigate(['/admin']);
        } else {
          this.router.navigateByUrl(this.returnUrl);
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}

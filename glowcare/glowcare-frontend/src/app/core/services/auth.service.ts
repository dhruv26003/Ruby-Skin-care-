import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, throwError, of } from 'rxjs';
import { User, AuthResponse } from '../models/user.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly toast = inject(ToastService);
  private readonly apiUrl = 'http://localhost:5000/api/auth';

  private readonly _currentUser = signal<User | null>(null);
  private readonly _token = signal<string | null>(null);

  public readonly currentUser = this._currentUser.asReadonly();
  public readonly token = this._token.asReadonly();
  public readonly isLoggedIn = computed(() => !!this._token());
  public readonly isAdmin = computed(() => this._currentUser()?.role === 'admin');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.loadStoredAuth();
    }
  }

  private loadStoredAuth(): void {
    try {
      const storedToken = localStorage.getItem('rubycare_token') || localStorage.getItem('glowcare_token');
      const storedUser = localStorage.getItem('rubycare_user') || localStorage.getItem('glowcare_user');

      if (storedToken && storedUser) {
        this._token.set(storedToken);
        this._currentUser.set(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn('Could not read stored authentication credentials', e);
    }
  }

  public register(data: { name: string; email: string; password: string; phone?: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      tap((res) => {
        if (res.success && res.token && res.user) {
          this.setSession(res.token, res.user);
          this.toast.success(`Welcome to RubyCare, ${res.user.name}!`);
        }
      }),
      catchError((err) => {
        const msg = err.error?.message || 'Registration failed. Please check your details.';
        this.toast.error(msg);
        return throwError(() => new Error(msg));
      })
    );
  }

  public login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap((res) => {
        if (res.success && res.token && res.user) {
          this.setSession(res.token, res.user);
          this.toast.success(`Welcome back, ${res.user.name}!`);
        }
      }),
      catchError((err) => {
        const msg = err.error?.message || 'Login failed. Invalid email or password.';
        this.toast.error(msg);
        return throwError(() => new Error(msg));
      })
    );
  }

  public logout(): void {
    this._token.set(null);
    this._currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('rubycare_token');
      localStorage.removeItem('rubycare_user');
      localStorage.removeItem('rubycare_wishlist');
      localStorage.removeItem('rubycare_wishlist_guest');
      localStorage.removeItem('rubycare_cart');
      localStorage.removeItem('rubycare_cart_guest');
      localStorage.removeItem('glowcare_token');
      localStorage.removeItem('glowcare_user');
      localStorage.removeItem('glowcare_wishlist');
      localStorage.removeItem('glowcare_wishlist_guest');
      localStorage.removeItem('glowcare_cart');
      localStorage.removeItem('glowcare_cart_guest');
    }
    this.toast.info('You have been logged out.');
  }

  public updateProfile(data: Partial<User>): Observable<any> {
    return this.http.put<{ success: boolean; user: User }>(`${this.apiUrl}/me`, data, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((res) => {
        if (res.success && res.user) {
          this._currentUser.set(res.user);
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('rubycare_user', JSON.stringify(res.user));
          }
          this.toast.success('Profile updated successfully!');
        }
      }),
      catchError((err) => {
        const msg = err.error?.message || 'Failed to update profile.';
        this.toast.error(msg);
        return throwError(() => new Error(msg));
      })
    );
  }

  public forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/forgot-password`, { email }).pipe(
      tap((res: any) => {
        this.toast.info(res.message || 'Password reset requested.');
      }),
      catchError((err) => {
        const msg = err.error?.message || 'Unable to request password reset.';
        this.toast.error(msg);
        return throwError(() => new Error(msg));
      })
    );
  }

  private setSession(token: string, user: User): void {
    this._token.set(token);
    this._currentUser.set(user);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('rubycare_token', token);
      localStorage.setItem('rubycare_user', JSON.stringify(user));
    }
  }

  public getAuthHeaders(): { [header: string]: string } {
    const t = this._token();
    return t ? { Authorization: `Bearer ${t}` } : {};
  }
}

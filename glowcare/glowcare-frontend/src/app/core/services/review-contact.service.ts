import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Review, ContactMessage } from '../models/common.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly apiUrl = 'http://localhost:5000/api/reviews';

  public getReviewsForProduct(productId: string): Observable<{ success: boolean; count: number; reviews: Review[] }> {
    return this.http.get<{ success: boolean; count: number; reviews: Review[] }>(
      `${this.apiUrl}/product/${productId}`
    );
  }

  public submitReview(reviewData: {
    productId: string;
    rating: number;
    title: string;
    comment: string;
    userName?: string;
  }): Observable<{ success: boolean; message: string; review: Review }> {
    return this.http.post<{ success: boolean; message: string; review: Review }>(
      this.apiUrl,
      reviewData,
      { headers: this.auth.getAuthHeaders() }
    );
  }

  // Admin
  public getAdminReviews(): Observable<{ success: boolean; reviews: Review[] }> {
    return this.http.get<{ success: boolean; reviews: Review[] }>(
      `http://localhost:5000/api/admin/reviews`,
      { headers: this.auth.getAuthHeaders() }
    );
  }

  public updateReviewStatus(id: string, status: string): Observable<any> {
    return this.http.patch(
      `http://localhost:5000/api/admin/reviews/${id}/status`,
      { status },
      { headers: this.auth.getAuthHeaders() }
    );
  }

  public deleteReview(id: string): Observable<any> {
    return this.http.delete(`http://localhost:5000/api/admin/reviews/${id}`, {
      headers: this.auth.getAuthHeaders()
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly apiUrl = 'http://localhost:5000/api';

  public submitContact(data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/contact`, data);
  }

  public subscribeNewsletter(email: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/contact/newsletter`, { email });
  }

  public getAdminMessages(): Observable<{ success: boolean; messages: ContactMessage[] }> {
    return this.http.get<{ success: boolean; messages: ContactMessage[] }>(
      `${this.apiUrl}/admin/messages`,
      { headers: this.auth.getAuthHeaders() }
    );
  }

  public markMessageStatus(id: string, status: string): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/admin/messages/${id}/status`,
      { status },
      { headers: this.auth.getAuthHeaders() }
    );
  }
}

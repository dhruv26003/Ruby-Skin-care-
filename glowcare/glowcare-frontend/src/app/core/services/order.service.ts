import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderCreateRequest } from '../models/order.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly apiUrl = 'http://localhost:5000/api';

  public placeOrder(orderData: OrderCreateRequest): Observable<{ success: boolean; message: string; order: Order }> {
    return this.http.post<{ success: boolean; message: string; order: Order }>(
      `${this.apiUrl}/orders`,
      orderData,
      { headers: this.auth.getAuthHeaders() }
    );
  }

  public getMyOrders(): Observable<{ success: boolean; count: number; orders: Order[] }> {
    return this.http.get<{ success: boolean; count: number; orders: Order[] }>(
      `${this.apiUrl}/orders/my-orders`,
      { headers: this.auth.getAuthHeaders() }
    );
  }

  public getOrderById(id: string): Observable<{ success: boolean; order: Order }> {
    return this.http.get<{ success: boolean; order: Order }>(
      `${this.apiUrl}/orders/${id}`,
      { headers: this.auth.getAuthHeaders() }
    );
  }

  // Admin Methods
  public getAdminOrders(): Observable<{ success: boolean; count: number; orders: Order[] }> {
    return this.http.get<{ success: boolean; count: number; orders: Order[] }>(
      `${this.apiUrl}/admin/orders`,
      { headers: this.auth.getAuthHeaders() }
    );
  }

  public updateOrderStatus(
    id: string,
    orderStatus: string,
    trackingNumber?: string
  ): Observable<{ success: boolean; order: Order }> {
    return this.http.patch<{ success: boolean; order: Order }>(
      `${this.apiUrl}/admin/orders/${id}/status`,
      { orderStatus, trackingNumber },
      { headers: this.auth.getAuthHeaders() }
    );
  }

  public getAdminDashboard(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/dashboard`, {
      headers: this.auth.getAuthHeaders()
    });
  }

  public getAdminCustomers(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/customers`, {
      headers: this.auth.getAuthHeaders()
    });
  }

  public getAdminList(): Observable<{ success: boolean; count: number; admins: any[] }> {
    return this.http.get<{ success: boolean; count: number; admins: any[] }>(`${this.apiUrl}/admin/admins`, {
      headers: this.auth.getAuthHeaders()
    });
  }

  public createAdmin(data: { name: string; email: string; password: string; phone?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/admins`, data, {
      headers: this.auth.getAuthHeaders()
    });
  }

  public deleteAdmin(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/admin/admins/${id}`, {
      headers: this.auth.getAuthHeaders()
    });
  }
}

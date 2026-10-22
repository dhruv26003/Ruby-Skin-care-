import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductsResponse, ProductDetailResponse, Category } from '../models/product.model';
import { AuthService } from './auth.service';

export interface ProductFilterParams {
  search?: string;
  category?: string;
  skinConcern?: string;
  skinType?: string;
  minPrice?: number;
  maxPrice?: number;
  onSale?: boolean;
  sort?: string;
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly apiUrl = 'http://localhost:5000/api';

  public getProducts(params?: ProductFilterParams): Observable<ProductsResponse> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.search) httpParams = httpParams.set('search', params.search);
      if (params.category && params.category !== 'all') httpParams = httpParams.set('category', params.category);
      if (params.skinConcern && params.skinConcern !== 'all') httpParams = httpParams.set('skinConcern', params.skinConcern);
      if (params.skinType && params.skinType !== 'all') httpParams = httpParams.set('skinType', params.skinType);
      if (params.minPrice) httpParams = httpParams.set('minPrice', params.minPrice.toString());
      if (params.maxPrice) httpParams = httpParams.set('maxPrice', params.maxPrice.toString());
      if (params.onSale) httpParams = httpParams.set('onSale', 'true');
      if (params.sort) httpParams = httpParams.set('sort', params.sort);
      if (params.page) httpParams = httpParams.set('page', params.page.toString());
      if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http.get<ProductsResponse>(`${this.apiUrl}/products`, { params: httpParams });
  }

  public getProductById(id: string): Observable<ProductDetailResponse> {
    return this.http.get<ProductDetailResponse>(`${this.apiUrl}/products/${id}`);
  }

  public getFeaturedProducts(): Observable<{ success: boolean; products: Product[] }> {
    return this.http.get<{ success: boolean; products: Product[] }>(`${this.apiUrl}/products/featured`);
  }

  public getBestsellers(): Observable<{ success: boolean; products: Product[] }> {
    return this.http.get<{ success: boolean; products: Product[] }>(`${this.apiUrl}/products/bestsellers`);
  }

  public getNewArrivals(): Observable<{ success: boolean; products: Product[] }> {
    return this.http.get<{ success: boolean; products: Product[] }>(`${this.apiUrl}/products/new-arrivals`);
  }

  public getCategories(): Observable<{ success: boolean; categories: Category[] }> {
    return this.http.get<{ success: boolean; categories: Category[] }>(`${this.apiUrl}/categories`);
  }

  // Admin Methods
  public createProduct(productData: Partial<Product>): Observable<{ success: boolean; product: Product }> {
    return this.http.post<{ success: boolean; product: Product }>(
      `${this.apiUrl}/products`,
      productData,
      { headers: this.auth.getAuthHeaders() }
    );
  }

  public updateProduct(id: string, productData: Partial<Product>): Observable<{ success: boolean; product: Product }> {
    return this.http.put<{ success: boolean; product: Product }>(
      `${this.apiUrl}/products/${id}`,
      productData,
      { headers: this.auth.getAuthHeaders() }
    );
  }

  public deleteProduct(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(
      `${this.apiUrl}/products/${id}`,
      { headers: this.auth.getAuthHeaders() }
    );
  }
}

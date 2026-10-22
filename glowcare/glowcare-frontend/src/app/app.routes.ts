import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
    title: 'RubyCare | Pure Botanical Skincare & Luxury Formulations'
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products.component').then((m) => m.ProductsComponent),
    title: 'Shop All Formulations | RubyCare Skincare'
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./features/product-details/product-details.component').then((m) => m.ProductDetailsComponent),
    title: 'Product Details | RubyCare Skincare'
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then((m) => m.CartComponent),
    title: 'Your Botanical Bag | RubyCare Skincare'
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.component').then((m) => m.CheckoutComponent),
    title: 'Safe Checkout | RubyCare Skincare'
  },
  {
    path: 'order-confirmation/:orderNumber',
    loadComponent: () => import('./features/order-confirmation/order-confirmation.component').then((m) => m.OrderConfirmationComponent),
    title: 'Order Confirmed | RubyCare Skincare'
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./features/wishlist/wishlist.component').then((m) => m.WishlistComponent),
    title: 'Saved Formulations | RubyCare Skincare'
  },
  {
    path: 'skincare-guide',
    loadComponent: () => import('./features/skincare-guide/skincare-guide.component').then((m) => m.SkincareGuideComponent),
    title: 'Skincare Guide & Routines | RubyCare'
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about.component').then((m) => m.AboutComponent),
    title: 'About Us & Purity Philosophy | RubyCare'
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact.component').then((m) => m.ContactComponent),
    title: 'Contact Concierge | RubyCare'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then((m) => m.LoginComponent),
    title: 'Sign In | RubyCare'
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then((m) => m.RegisterComponent),
    title: 'Create Account | RubyCare'
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./features/auth/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
    title: 'Reset Password | RubyCare'
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
    title: 'My Ritual Account | RubyCare'
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin.component').then((m) => m.AdminComponent),
    canActivate: [adminGuard],
    title: 'Admin Control Center | RubyCare'
  },
  {
    path: '404',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Page Not Found | RubyCare'
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
    title: 'Page Not Found | RubyCare'
  }
];

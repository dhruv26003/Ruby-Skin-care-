# 🌿 RubyCare — Luxury Botanical Skincare E-Commerce Platform

A complete, production-grade, full-stack skincare e-commerce web application built with **Angular 21 (TypeScript & SCSS)**, **Node.js/Express REST API**, and **MongoDB with Mongoose** (featuring an automatic zero-config Demo Mode fallback).

Designed and engineered as a final-year college capstone project showcasing modern frontend architecture, role-based security, stateful shopping experiences, and rigorous REST API practices.

---

## 🌟 Key Highlights & Feature Matrix

### 1. Visual Aesthetics & Design System
- **Luxury Botanical Aesthetic:** Curated color palette including warm ivory (`#FAF7F2`), soft beige (`#F4EFE6`), muted sage green (`#4E6B5D`), and champagne gold (`#C6A779`).
- **Prestige Typography:** Harmonious pairing of *Playfair Display* serif headings and *Plus Jakarta Sans* body text.
- **Micro-Interactions & Transitions:** Fluid card hover elevations, smooth badge ribbons, sliding cart badges, dynamic image thumbnail switchers, and non-intrusive floating toast notifications.

### 2. Frontend Features (Angular 21 Standalone)
- **Home Page (`/`):**
  - Announcement bar with active promo code highlights.
  - Hero banner with headline *"Your Skin, Your Natural Glow"*, call-to-actions, and clinical efficacy stats.
  - 4-Pillar benefits showcase (Clean Botanical Actives, Clinically Backed, Barrier-First, Leaping Bunny Cruelty-Free).
  - Curated category explore cards.
  - Dynamic best-selling and new-arrival product carousels/grids.
  - Editorial promotional banner for signature formulations.
  - Verified customer testimonials with star ratings.
  - Skincare routine preview linking to the routine planner.
- **Products Catalog (`/products`):**
  - Responsive layout with desktop sidebar & mobile drawer.
  - Multi-criteria filtering by Category (7 categories), Skin Concern (Dark Spots, Acne, Dehydration, Fine Lines, Large Pores, Redness), Skin Type (Sensitive, Oily, Dry, Combination), Price Slider ($20–$70), and Special Offers Only.
  - Real-time search across titles, descriptions, and botanical ingredients.
  - Sorting by Price (Low to High / High to Low), Rating, Popularity, and Newest.
  - Dismissible active filter tag chips.
  - Pagination and empty-state recovery.
- **Product Details Page (`/products/:id`):**
  - High-resolution gallery with active image switcher and thumbnail navigation.
  - Comprehensive clinical description, active ingredient highlights, and usage instructions with tabbed navigation.
  - Stock availability badges with low-stock alerts.
  - Quantity selector stepper with live subtotal calculation.
  - One-click *Add to Bag* and *Add to Wishlist* with toast alerts.
  - Customer review list with verified client badges and an interactive review submission form with star rating selector.
  - Related product recommendations based on shared skincare categories.
- **Shopping Cart (`/cart`):**
  - Free shipping threshold tracker with animated progress bar (Free shipping at $50+).
  - Line-item quantity controls (+ / - / remove).
  - Server-validated promo coupon field (`GLOW10`, `WELCOME20`, `FREESHIP`).
  - Real-time calculation of subtotal, discount, shipping fee, and grand total.
  - LocalStorage persistence for guest users with SSR hydration safety.
- **Safe Demo Checkout (`/checkout`):**
  - Customer contact details and complete delivery address form with reactive validation.
  - Safe Demo Mode simulator (Choice of Instant Demo Card or Cash On Delivery with zero collection of real card numbers).
  - Order summary sidebar displaying items snapshots and fee breakdowns.
  - Server-side price recalculation preventing client tampering.
- **Order Confirmation (`/order-confirmation/:orderNumber`):**
  - Dedicated receipt page featuring unique order reference numbers (e.g. `GLOW-91144`).
  - Estimated dispatch and delivery dates.
  - Delivery address summary and itemized cost review.
- **Wishlist (`/wishlist`):**
  - Saved favorites grid with quick *Add to Bag* and *Move All to Bag* operations.
  - Automatic synchronization between guest local storage and user database profile upon login.
- **Skincare Science Guide (`/skincare-guide`):**
  - Chronobiological Morning Routine (Defense) vs. Evening Routine (Repair).
  - Detailed active ingredient encyclopedia (Vitamin C, Niacinamide, Hyaluronic Acid, 5-Ceramides, Bakuchiol, Non-Nano Zinc Oxide).
  - 30-minute self-diagnostic skin type guide.
  - Prominent dermatological medical disclaimer.
- **About Us (`/about`):**
  - Brand story, barrier-first formulation ethos, and sustainable frosted amber glass packaging standards.
- **Contact Us (`/contact`):**
  - Client concierge inquiry form with client & server-side validation.
  - Physical headquarters information, customer advisory hours, and FAQ accordion.
- **Authentication (`/login`, `/register`, `/forgot-password`):**
  - Password strength validation and bcrypt-hashed storage.
  - One-click demo credentials autofill buttons for Admin and Customer testing.
  - JWT session token storage and automatic authorization state updates.
- **Customer Profile (`/profile`):**
  - Personal information and delivery address updates.
  - Complete order history with order status badges ('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled').
- **Admin Control Center (`/admin`):**
  - Protected by role-based `adminGuard` and backend JWT role middleware.
  - Metric KPI cards: Total Verified Sales, Total Orders, Active Formulations, and Registered Customers.
  - Order Management: Change order statuses and assign live tracking numbers.
  - Product Inventory CRUD: Modal to add new skincare products, edit pricing/stock, and delete items.
  - Client Inquiries: View and mark contact messages as reviewed.
  - Review Moderation: Inspect and delete customer reviews.

---

## 🛠️ Architecture & Tech Stack

```
                              ┌─────────────────────────────────────────┐
                              │           Angular 21 Frontend           │
                              │  Standalone Components • Signals • SCSS │
                              │      Angular Router • Reactive Forms    │
                              └────────────────────┬────────────────────┘
                                                   │ HTTP / REST
                                                   ▼
                              ┌─────────────────────────────────────────┐
                              │          Express REST API Backend       │
                              │     Node.js • TypeScript (tsx engine)   │
                              │     JWT Auth • Bcrypt • Rate Limiting   │
                              └────────────┬──────────────────┬─────────┘
                                           │                  │
                [If MongoDB Running]       │                  │ [If MongoDB Unavailable]
                                           ▼                  ▼
                              ┌─────────────────────────┐   ┌─────────────────────────┐
                              │     MongoDB (Mongoose)  │   │   In-Memory Demo Store  │
                              │   Collections & Indexes │   │  100% Functional Fallback│
                              └─────────────────────────┘   └─────────────────────────┘
```

---

## 🚀 Quick Start Guide (Windows)

### Prerequisites
- Node.js LTS (v20+ or v24+ recommended)
- npm (v10+ or v11+)
- Optional: MongoDB running on `mongodb://127.0.0.1:27017/glowcare` (not required; automatic demo in-memory fallback engages if offline)

### 1. Running the Backend REST API
Open a command prompt or PowerShell terminal in `glowcare/glowcare-backend`:
```powershell
# Navigate to backend directory
cd "d:\project\skin care website\glowcare\glowcare-backend"

# Install dependencies (already executed)
npm install

# Start the backend server (runs on port 5000)
npm start
```
The server will start on **`http://localhost:5000`**.

### 2. Running the Angular Frontend
Open a second command prompt or PowerShell terminal in `glowcare/glowcare-frontend`:
```powershell
# Navigate to frontend directory
cd "d:\project\skin care website\glowcare\glowcare-frontend"

# Install dependencies (already executed)
npm install

# Start the Angular dev server (runs on port 4200)
npm start
```
The application will be accessible at **`http://localhost:4200`**.

---

## 🔑 Demo Credentials for Testing & Grading

| Role | Email | Password | Access Rights |
| :--- | :--- | :--- | :--- |
| **Store Administrator** | `admin@glowcare.com` | `Admin@123` | Full access to `/admin` dashboard, inventory CRUD, order status updater, review moderation. |
| **Demo Customer** | `customer@glowcare.com` | `Customer@123` | Order history, saved addresses, wishlist, reviews. |

*Tip: The `/login` page includes one-click autofill buttons for both accounts.*

---

## 🎟️ Active Demo Coupons

| Coupon Code | Discount | Minimum Subtotal | Description |
| :--- | :--- | :--- | :--- |
| **`GLOW10`** | 10% Off | $20.00 | Sitewide welcome discount |
| **`WELCOME20`** | 20% Off | $50.00 | First ritual celebratory offer |
| **`FREESHIP`** | $5.00 Off | $30.00 | Shipping fee waiver |

---

## 📡 REST API Endpoint Documentation

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | Public | System status, mode (MongoDB vs Demo), product counts |
| **POST** | `/api/auth/register` | Public | Register new user account |
| **POST** | `/api/auth/login` | Public | Authenticate user & issue JWT token |
| **GET** | `/api/auth/me` | Protected | Current user profile |
| **PUT** | `/api/auth/me` | Protected | Update profile & delivery addresses |
| **GET** | `/api/products` | Public | Catalog with search, filter, sort, pagination |
| **GET** | `/api/products/featured` | Public | Featured carousel products |
| **GET** | `/api/products/bestsellers` | Public | Best-selling products |
| **GET** | `/api/products/new-arrivals` | Public | Newly added skincare formulas |
| **GET** | `/api/products/:id` | Public | Product details by ID or Slug + related items |
| **POST** | `/api/products` | Admin | Create new formulation |
| **PUT** | `/api/products/:id` | Admin | Update formulation |
| **DELETE**| `/api/products/:id` | Admin | Delete formulation |
| **GET** | `/api/categories` | Public | List all 7 categories |
| **POST** | `/api/coupons/validate` | Public | Validate coupon code & calculate discount |
| **POST** | `/api/orders` | Optional Auth | Create order with server-calculated totals |
| **GET** | `/api/orders/my-orders` | Protected | Customer's order history |
| **GET** | `/api/orders/:id` | Public | Order confirmation details |
| **GET** | `/api/admin/dashboard` | Admin | High-level sales and operational KPIs |
| **GET** | `/api/admin/orders` | Admin | List all customer orders |
| **PATCH**| `/api/admin/orders/:id/status`| Admin | Update order status & tracking number |
| **GET** | `/api/wishlist` | Protected | User wishlist products |
| **POST** | `/api/wishlist/toggle` | Protected | Toggle product in wishlist |
| **GET** | `/api/reviews/product/:id` | Public | Approved reviews for product |
| **POST** | `/api/reviews` | Optional Auth | Submit new customer review |
| **POST** | `/api/contact` | Public | Submit concierge contact inquiry |
| **POST** | `/api/contact/newsletter` | Public | Subscribe to newsletter |

---

## 📂 Project Directory Structure

```
d:\project\skin care website\glowcare
├── README.md                          <-- Master documentation
├── glowcare-backend/
│   ├── package.json                   <-- Express, Mongoose, JWT, bcrypt, tsx
│   ├── tsconfig.json
│   ├── .env                           <-- Environment variables (PORT, JWT_SECRET, MONGODB_URI)
│   ├── .env.example
│   ├── test-api.mjs                   <-- Automated API verification script
│   ├── test-e2e.mjs                   <-- 14-Step End-to-End integration test suite
│   └── src/
│       ├── index.ts                   <-- Express app entry point
│       ├── config/db.ts               <-- Dual-mode MongoDB connector & fallback
│       ├── models/                    <-- Mongoose schemas (User, Product, Category, Order, Review, Coupon, Contact)
│       ├── data/
│       │   ├── seedData.ts            <-- 16 rich realistic products & 7 categories
│       │   └── inMemoryStore.ts       <-- High-fidelity zero-config demo store
│       ├── middleware/
│       │   ├── auth.ts                <-- JWT protect & admin authorize
│       │   └── errorHandler.ts        <-- Centralized error sanitization
│       ├── routes/                    <-- API route modules
│       └── scripts/seed.ts            <-- MongoDB seeding script (`npm run seed`)
│
└── glowcare-frontend/
    ├── package.json                   <-- Angular 21, TypeScript, SCSS
    ├── angular.json                   <-- Angular build configurations & budgets
    ├── tsconfig.json
    ├── src/
    │   ├── index.html                 <-- Fonts, SEO meta, favicon
    │   ├── styles.scss                <-- Design system variables, buttons, grids
    │   ├── app/
    │   │   ├── app.ts                 <-- Root standalone component
    │   │   ├── app.html               <-- Header, router-outlet, Footer, Toast
    │   │   ├── app.scss
    │   │   ├── app.routes.ts          <-- Angular route definitions & titles
    │   │   ├── app.config.ts          <-- HttpClient, hydration, scroll restoration
    │   │   ├── app.routes.server.ts   <-- SSR server route modes
    │   │   ├── core/
    │   │   │   ├── models/            <-- TypeScript interfaces (Product, User, Cart, Order, Review)
    │   │   │   ├── services/          <-- Signal-driven services (Auth, Cart, Wishlist, Product, Order, Toast)
    │   │   │   └── guards/            <-- authGuard & adminGuard
    │   │   ├── shared/components/
    │   │   │   ├── header/            <-- Announcement bar, logo, search, cart/wishlist counters, auth menu
    │   │   │   ├── footer/            <-- Newsletter, shop links, skin science, academic notice
    │   │   │   ├── product-card/      <-- Hover effects, badges, quick add, wishlist toggle
    │   │   │   ├── rating-stars/      <-- Dynamic star rating display
    │   │   │   └── toast/             <-- Animated notification alerts
    │   │   └── features/
    │   │       ├── home/              <-- Hero banner, 4-pillars, bestsellers, promo, testimonials
    │   │       ├── products/          <-- Category, concern, price filters, search, sort, pagination
    │   │       ├── product-details/   <-- Gallery, tabs, ingredient transparency, write-review
    │   │       ├── cart/              <-- Free shipping progress, coupon validator, quantity stepper
    │   │       ├── checkout/          <-- Address form validation, safe demo payment simulator
    │   │       ├── order-confirmation/<-- Receipt, tracking estimates, item breakdown
    │   │       ├── wishlist/          <-- Saved rituals, move to bag
    │   │       ├── skincare-guide/    <-- AM/PM routines, ingredient encyclopedia, medical disclaimer
    │   │       ├── about/             <-- Brand story, clean science, sustainability
    │   │       ├── contact/           <-- Concierge contact form, FAQ
    │   │       ├── auth/              <-- Login (demo one-click buttons), Register, Forgot Password
    │   │       ├── profile/           <-- Account management & order tracking
    │   │       ├── admin/             <-- Dashboard metrics, order manager, product CRUD, reviews
    │   │       └── not-found/         <-- 404 page
```

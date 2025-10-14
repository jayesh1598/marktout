# MarkTout D2C – Laravel API

**Date:** 2025-10-14

This is a production-ready Laravel API backend designed to power the uploaded React + Vite D2C frontend (the “Ecommerce UI for MarkTout”). It uses **Laravel 11 + Sanctum** for auth and follows a clean RESTful resource structure with OpenAPI documentation and a Postman collection.

## Features

- User auth (register/login/logout, profile) via Sanctum
- Products, Categories with inventory & variants (simplified)
- Cart & Checkout
- Orders & Order items
- Addresses
- Coupons & validation
- Reviews & Ratings
- Banners / Home highlights
- File uploads (product images) via Laravel storage
- CORS enabled
- Pagination, filtering, and sorting
- OpenAPI 3.1 docs in `/docs/openapi.yaml` (render on Swagger UI or Redoc)
- Postman collection in `/docs/MarkTout.postman_collection.json`

## Quick Start

1. **Create a fresh Laravel project** (PHP 8.2+, Composer required):

```bash
composer create-project laravel/laravel marktout-api
cd marktout-api
```

2. **Install Sanctum & set up CORS**

```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan migrate
```

In `config/cors.php`, set allowed origins and headers to include your Vite dev server:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://your-frontend-domain'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
'supports_credentials' => true,
```

3. **Copy these folders/files into the fresh app**

- `app/` (models, controllers, requests, resources)
- `routes/api.php` (merge or replace)
- `database/migrations/*` (add; then run migrations)
- `database/seeders/*` (optional seed data)
- `docs/openapi.yaml` & `docs/MarkTout.postman_collection.json`

4. **Environment**

In `.env` set DB and app URL:
```
APP_URL=http://localhost
FRONTEND_URL=http://localhost:5173
SESSION_DRIVER=cookie
SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

5. **Migrate & seed**

```bash
php artisan migrate
php artisan db:seed --class=DemoSeeder
```

6. **Run**

```bash
php artisan serve
```

API base URL will be: `http://localhost:8000/api`

## Frontend Integration

Inside your React project, configure:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

Use the provided adapters under `/frontend-adapters/` as a starting point:
- `src/lib/apiClient.ts`
- `src/services/auth.ts`, `products.ts`, `cart.ts`, `orders.ts`, `addresses.ts`

Copy into your frontend `src/` and adjust routes as needed.

## Security Notes

- Use HTTPS in production
- Rotate APP_KEY and set proper CORS rules
- Validate & authorize admin routes (this starter uses simple `is_admin` flag)
- Store files on S3 or a secure disk for production



---

## Payments – Razorpay Integration

### Install SDK
```bash
composer require razorpay/razorpay
```

### .env
```
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxxxxxxxxxx
RAZORPAY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx
PAYMENT_CURRENCY=INR
```

### Endpoints
- `POST /api/v1/payments/razorpay/order` → creates a Razorpay order for the current cart total.
- `POST /api/v1/payments/razorpay/verify` → verifies payment signature after checkout.
- `POST /api/v1/webhooks/razorpay` → webhook receiver (configure in Razorpay Dashboard).

**Flow:**
1. Client calls `/payments/razorpay/order` to get `{order_id, amount, currency, key_id}`.
2. Open Razorpay Checkout on the frontend.
3. After success, client POSTs `{razorpay_order_id, razorpay_payment_id, razorpay_signature}` to `/payments/razorpay/verify`.
4. Server verifies signature, records a `payments` row, and marks the local `orders.payment_status = paid`.

---

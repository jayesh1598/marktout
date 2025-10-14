# MarkTout D2C – Fullstack (Laravel API + React Frontend)
**Generated:** 2025-10-14

This package contains a Laravel 11 API backend and a React + Vite frontend integration pack wired to the API.

## Structure
- `backend-laravel/` – Laravel API source (controllers, models, migrations, seeders, routes, docs)
- `frontend-react/` – React `src/` drop-in with API client, services, auth context, pages, and routing

## Quick Start

### Backend (Laravel)
1. Create a fresh Laravel app (PHP 8.2+):
   ```bash
   composer create-project laravel/laravel marktout-api
   cd marktout-api
   ```
2. Install Sanctum and publish:
   ```bash
   composer require laravel/sanctum
   php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"
   ```
3. Copy files from `backend-laravel/` into your Laravel project root (merge/replace existing where appropriate).
4. Configure `.env`:
   ```
   APP_URL=http://localhost
   FRONTEND_URL=http://localhost:5173
   SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
   ```
5. CORS (`config/cors.php`):
   ```php
   'paths' => ['api/*', 'sanctum/csrf-cookie'],
   'allowed_origins' => ['http://localhost:5173','http://127.0.0.1:5173'],
   'allowed_methods' => ['*'],
   'allowed_headers' => ['*'],
   'supports_credentials' => true,
   ```
6. Add admin Gate in `app/Providers/AuthServiceProvider.php`:
   ```php
   use Illuminate\\Support\\Facades\\Gate;
   public function boot(): void {
       Gate::define('admin', fn($user) => (bool) $user->is_admin);
   }
   ```
7. Migrate & seed:
   ```bash
   php artisan migrate
   php artisan db:seed --class=DemoSeeder
   php artisan serve
   ```
   API base: `http://localhost:8000/api/v1`

### Frontend (React + Vite)
1. In your existing React app, set:
   ```
   VITE_API_BASE_URL=http://localhost:8000/api/v1
   ```
2. Copy everything from `frontend-react/` **into your project's `src/`** (merge with care).
3. Ensure `react-router-dom` is installed.
4. Run the app:
   ```bash
   npm run dev
   ```

## Docs
- OpenAPI: `backend-laravel/docs/openapi.yaml`
- Postman: `backend-laravel/docs/MarkTout.postman_collection.json`

## Notes
- Default seeded admin: `admin@example.com` / `password`
- Swap storage to S3 and add a payment gateway later as needed.


## Payments (Razorpay)
- Backend SDK: `composer require razorpay/razorpay`
- Set `.env` `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
- Endpoints added under `/api/v1/payments/*` and `/api/v1/webhooks/razorpay`
- Frontend includes `RazorpayCheckoutButton.tsx` that opens Razorpay Checkout JS.

## Database
- Full MySQL DDL included at `backend-laravel/docs/schema.sql`
- Or run Laravel migrations in `backend-laravel/database/migrations/`


### Live data (no mocks)
- Frontend components now fetch all data from the Laravel API (no seeded UI defaults).
- Login form has no preset credentials; use real users registered via the API or your seeded admin.
- Checkout address form fields start empty and submit to the live `/addresses` endpoint.

### Environment files
- Backend includes `.env.example` with DB + Razorpay placeholders. Duplicate to `.env` and fill real values.
- `config/services.php.patch` is provided to safely merge Razorpay settings into your project.

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\CartController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\AddressController;
use App\Http\Controllers\Api\CouponController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\BannerController;

Route::prefix('v1')->group(function () {
    Route::post('/webhooks/razorpay', [\App\Http\Controllers\Api\RazorpayWebhookController::class, 'handle']);
    // Public
    Route::get('/health', fn() => response()->json(['ok' => true]));
    Route::post('/auth/register', [AuthController::class, 'register']);
    Route::post('/auth/login', [AuthController::class, 'login']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/banners', [BannerController::class, 'index']);
    Route::post('/coupons/validate', [CouponController::class, 'validateCode']);

    // Authenticated
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/payments/razorpay/order', [\App\Http\Controllers\Api\PaymentController::class, 'createRazorpayOrder']);
        Route::post('/payments/razorpay/verify', [\App\Http\Controllers\Api\PaymentController::class, 'verifyRazorpay']);
        Route::post('/auth/logout', [AuthController::class, 'logout']);
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Cart
        Route::get('/cart', [CartController::class, 'show']);
        Route::post('/cart/items', [CartController::class, 'addItem']);
        Route::patch('/cart/items/{item}', [CartController::class, 'updateItem']);
        Route::delete('/cart/items/{item}', [CartController::class, 'removeItem']);
        Route::delete('/cart', [CartController::class, 'clear']);

        // Addresses
        Route::apiResource('addresses', AddressController::class);

        // Orders
        Route::post('/orders', [OrderController::class, 'store']);
        Route::get('/orders', [OrderController::class, 'index']);
        Route::get('/orders/{order}', [OrderController::class, 'show']);

        // Reviews
        Route::post('/products/{product}/reviews', [ReviewController::class, 'store']);
    });

    // Admin
    Route::middleware(['auth:sanctum', 'can:admin'])
        ->prefix('admin')
        ->group(function () {
            Route::apiResource('products', ProductController::class)->except(['index', 'show']);
            Route::apiResource('categories', CategoryController::class)->except(['index', 'show']);
            Route::apiResource('banners', BannerController::class)->except(['index', 'show']);
            Route::apiResource('coupons', CouponController::class)->except(['validateCode']);
        });
});

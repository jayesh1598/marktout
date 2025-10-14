<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->string('provider')->default('razorpay');
            $table->string('provider_order_id')->nullable()->index();
            $table->string('provider_payment_id')->nullable()->index();
            $table->string('provider_signature')->nullable();
            $table->decimal('amount', 10, 2)->default(0);
            $table->string('currency', 10)->default('INR');
            $table->string('status')->default('created');
            $table->json('payload')->nullable();
            $table->json('meta')->nullable();
            $table->timestamps();
        });
    }
    public function down(): void {
        Schema::dropIfExists('payments');
    }
};

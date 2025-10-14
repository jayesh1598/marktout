<?php

namespace App\Services;

use Razorpay\Api\Api;

class RazorpayService
{
    protected Api $api;

    public function __construct()
    {
        $this->api = new Api(config('services.razorpay.key'), config('services.razorpay.secret'));
    }

    public function createOrder(int $amount, string $currency = 'INR', array $notes = []): array
    {
        $order = $this->api->order->create([
            'amount' => $amount, // in paise
            'currency' => $currency,
            'payment_capture' => 1,
            'notes' => $notes,
        ]);
        return $order->toArray();
    }

    public function verifySignature(string $orderId, string $paymentId, string $signature): bool
    {
        $data = $orderId . '|' . $paymentId;
        $expected = hash_hmac('sha256', $data, config('services.razorpay.secret'));
        return hash_equals($expected, $signature);
    }
}

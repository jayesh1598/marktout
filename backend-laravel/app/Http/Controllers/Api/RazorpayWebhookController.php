<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Payment;
use Illuminate\Support\Facades\Log;

class RazorpayWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $signature = $request->header('X-Razorpay-Signature');
        $secret = config('services.razorpay.webhook_secret');

        $payload = $request->getContent();
        $expected = hash_hmac('sha256', $payload, $secret);

        if (!hash_equals($expected, (string)$signature)) {
            return response()->json(['message'=>'Invalid signature'], 400);
        }

        $event = $request->input('event');
        $payloadArr = $request->all();
        Log::info('Razorpay webhook', ['event'=>$event]);

        // Optionally update payment status based on event
        if (($payloadArr['payload']['payment']['entity']['order_id'] ?? null)) {
            $orderId = $payloadArr['payload']['payment']['entity']['order_id'];
            $payment = Payment::where('provider_order_id', $orderId)->first();
            if ($payment) {
                $payment->update(['payload' => $payloadArr, 'status' => $payloadArr['payload']['payment']['entity']['status'] ?? $payment->status]);
            }
        }

        return response()->json(['ok'=>true]);
    }
}

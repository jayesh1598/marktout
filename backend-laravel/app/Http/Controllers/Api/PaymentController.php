<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Cart, Order, Payment};
use App\Services\RazorpayService;
use Illuminate\Support\Facades\DB;

class PaymentController extends Controller
{
    public function createRazorpayOrder(Request $request, RazorpayService $rzp)
    {
        $user = $request->user();
        $cart = Cart::with('items.product','coupon')->firstOrCreate(['user_id'=>$user->id]);
        $subtotal = $cart->items->sum(fn($i) => $i->quantity * $i->unit_price);
        $discount = 0;
        if ($cart->coupon) {
            $c = $cart->coupon;
            if ($c->active && (!$c->starts_at || now()->gte($c->starts_at)) && (!$c->ends_at || now()->lte($c->ends_at)) && (!$c->min_subtotal || $subtotal >= $c->min_subtotal)) {
                $discount = $c->type === 'percent' ? $subtotal * ($c->value/100) : $c->value;
                if ($c->max_discount) $discount = min($discount, $c->max_discount);
            }
        }
        $total = max($subtotal - $discount, 0);

        if ($total <= 0) {
            return response()->json(['message'=>'Cart total must be > 0'], 422);
        }

        // Create local pending order first
        $order = Order::create([
            'user_id' => $user->id,
            'address_id' => $request->input('address_id'),
            'subtotal' => $subtotal,
            'discount' => $discount,
            'total' => $total,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'coupon_id' => $cart->coupon_id,
        ]);

        foreach ($cart->items as $ci) {
            $order->items()->create([
                'product_id' => $ci->product_id,
                'quantity' => $ci->quantity,
                'unit_price' => $ci->unit_price,
                'line_total' => $ci->quantity * $ci->unit_price,
            ]);
        }

        $amountPaise = (int) round($total * 100);
        $r = $rzp->createOrder($amountPaise, config('app.payment_currency','INR'), ['local_order_id' => (string)$order->id]);

        // Record a payment row (pending)
        $pay = Payment::create([
            'user_id' => $user->id,
            'order_id' => $order->id,
            'provider' => 'razorpay',
            'provider_order_id' => $r['id'] ?? null,
            'amount' => $total,
            'currency' => $r['currency'] ?? 'INR',
            'status' => 'created',
            'payload' => $r,
        ]);

        return response()->json([
            'key_id' => config('services.razorpay.key'),
            'razorpay_order_id' => $r['id'],
            'amount' => $amountPaise,
            'currency' => $r['currency'],
            'local_order_id' => $order->id,
        ]);
    }

    public function verifyRazorpay(Request $request, RazorpayService $rzp)
    {
        $data = $request->validate([
            'razorpay_order_id' => 'required|string',
            'razorpay_payment_id' => 'required|string',
            'razorpay_signature' => 'required|string',
        ]);

        $ok = $rzp->verifySignature($data['razorpay_order_id'], $data['razorpay_payment_id'], $data['razorpay_signature']);
        if (!$ok) return response()->json(['message'=>'Invalid signature'], 422);

        $payment = Payment::where('provider_order_id', $data['razorpay_order_id'])->first();
        if (!$payment) return response()->json(['message'=>'Payment not found'], 404);

        DB::transaction(function() use ($payment, $data) {
            $payment->update([
                'provider_payment_id' => $data['razorpay_payment_id'],
                'provider_signature' => $data['razorpay_signature'],
                'status' => 'paid',
            ]);
            $order = $payment->order()->lockForUpdate()->first();
            $order->update(['payment_status' => 'paid', 'status' => 'processing']);
            // Clear cart after payment success
            $order->user->cart?->items()->delete();
            $order->user->cart?->update(['coupon_id'=>null]);
        });

        return response()->json(['message'=>'Payment verified', 'payment'=>$payment->fresh()]);
    }
}

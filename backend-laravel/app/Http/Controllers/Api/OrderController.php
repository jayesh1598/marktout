<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Order, OrderItem, Cart, CartItem, Address};

class OrderController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->orders()->with('items.product','address')->latest()->paginate(10);
    }

    public function show(Request $request, Order $order)
    {
        $this->authorize('view', $order);
        return $order->load('items.product','address');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'address_id' => 'required|integer|exists:addresses,id',
        ]);

        $user = $request->user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        $cart->load('items.product','coupon');

        if ($cart->items->count() === 0) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        $subtotal = $cart->items->sum(fn($i) => $i->quantity * $i->unit_price);
        $discount = 0;
        if ($cart->coupon) {
            // reuse CartController calc logic (simple copy here for brevity)
            $c = $cart->coupon;
            if ($c->active && (!$c->starts_at || now()->gte($c->starts_at)) && (!$c->ends_at || now()->lte($c->ends_at)) && (!$c->min_subtotal || $subtotal >= $c->min_subtotal)) {
                $discount = $c->type === 'percent' ? $subtotal * ($c->value/100) : $c->value;
                if ($c->max_discount) $discount = min($discount, $c->max_discount);
            }
        }
        $total = max($subtotal - $discount, 0);

        $order = Order::create([
            'user_id' => $user->id,
            'address_id' => $data['address_id'],
            'subtotal' => $subtotal,
            'discount' => $discount,
            'total' => $total,
            'status' => 'pending',
            'payment_status' => 'unpaid',
            'coupon_id' => $cart->coupon_id,
        ]);

        foreach ($cart->items as $ci) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $ci->product_id,
                'quantity' => $ci->quantity,
                'unit_price' => $ci->unit_price,
                'line_total' => $ci->quantity * $ci->unit_price,
            ]);
            // decrement stock
            $ci->product->decrement('stock', $ci->quantity);
        }

        // clear cart
        $cart->items()->delete();
        $cart->coupon_id = null;
        $cart->save();

        // Payment: integrate your PG webhook later
        return response()->json($order->load('items.product','address'), 201);
    }
}

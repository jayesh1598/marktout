<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Cart, CartItem, Product, Coupon};

class CartController extends Controller
{
    protected function getCart($userId)
    {
        return Cart::firstOrCreate(['user_id' => $userId]);
    }

    public function show(Request $request)
    {
        $cart = $this->getCart($request->user()->id)->load('items.product', 'coupon');
        $subtotal = $cart->items->sum(fn($i) => $i->quantity * $i->unit_price);
        $discount = 0;
        if ($cart->coupon) {
            $discount = $this->calcDiscount($cart->coupon, $subtotal);
        }
        return response()->json([
            'cart' => $cart,
            'subtotal' => round($subtotal,2),
            'discount' => round($discount,2),
            'total' => round($subtotal - $discount,2),
        ]);
    }

    public function addItem(Request $request)
    {
        $data = $request->validate([
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);
        $cart = $this->getCart($request->user()->id);
        $product = Product::findOrFail($data['product_id']);
        $item = CartItem::firstOrCreate(
            ['cart_id' => $cart->id, 'product_id' => $product->id],
            ['quantity' => 0, 'unit_price' => $product->price]
        );
        $item->quantity += $data['quantity'];
        $item->unit_price = $product->price;
        $item->save();

        return $this->show($request);
    }

    public function updateItem(Request $request, CartItem $item)
    {
        $this->authorize('update', $item->cart);
        $data = $request->validate([ 'quantity' => 'required|integer|min:1' ]);
        $item->update($data);
        return $this->show($request);
    }

    public function removeItem(Request $request, CartItem $item)
    {
        $this->authorize('update', $item->cart);
        $item->delete();
        return $this->show($request);
    }

    public function clear(Request $request)
    {
        $cart = $this->getCart($request->user()->id);
        $cart->items()->delete();
        $cart->coupon_id = null;
        $cart->save();
        return $this->show($request);
    }

    protected function calcDiscount(Coupon $coupon, $subtotal)
    {
        if (!$coupon->active) return 0;
        if ($coupon->starts_at && now()->lt($coupon->starts_at)) return 0;
        if ($coupon->ends_at && now()->gt($coupon->ends_at)) return 0;
        if ($coupon->min_subtotal && $subtotal < $coupon->min_subtotal) return 0;

        $discount = 0;
        if ($coupon->type === 'percent') {
            $discount = $subtotal * ($coupon->value / 100);
        } else {
            $discount = $coupon->value;
        }
        if ($coupon->max_discount) {
            $discount = min($discount, $coupon->max_discount);
        }
        return max($discount, 0);
    }
}

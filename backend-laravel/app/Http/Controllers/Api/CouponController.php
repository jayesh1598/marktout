<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Coupon;

class CouponController extends Controller
{
    public function index()
    {
        return Coupon::latest()->paginate(20);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'code'=>'required|string|max:50|unique:coupons,code',
            'type'=>'required|in:percent,fixed',
            'value'=>'required|numeric|min:0',
            'min_subtotal'=>'nullable|numeric|min:0',
            'max_discount'=>'nullable|numeric|min:0',
            'starts_at'=>'nullable|date',
            'ends_at'=>'nullable|date|after:starts_at',
            'active'=>'boolean'
        ]);
        $c = Coupon::create($data);
        return response()->json($c, 201);
    }

    public function update(Request $request, Coupon $coupon)
    {
        $data = $request->validate([
            'code'=>'sometimes|string|max:50|unique:coupons,code,' . $coupon->id,
            'type'=>'sometimes|in:percent,fixed',
            'value'=>'sometimes|numeric|min:0',
            'min_subtotal'=>'nullable|numeric|min:0',
            'max_discount'=>'nullable|numeric|min:0',
            'starts_at'=>'nullable|date',
            'ends_at'=>'nullable|date|after:starts_at',
            'active'=>'boolean'
        ]);
        $coupon->update($data);
        return $coupon;
    }

    public function destroy(Coupon $coupon)
    {
        $coupon->delete();
        return response()->noContent();
    }

    public function validateCode(Request $request)
    {
        $data = $request->validate([ 'code' => 'required|string' ]);
        $coupon = Coupon::where('code', $data['code'])->first();
        if (!$coupon || !$coupon->active) {
            return response()->json(['valid'=>false, 'message'=>'Invalid coupon'], 404);
        }
        return response()->json(['valid'=>true, 'coupon'=>$coupon]);
    }
}

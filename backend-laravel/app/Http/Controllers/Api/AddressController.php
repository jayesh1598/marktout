<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Address;

class AddressController extends Controller
{
    public function index(Request $request)
    {
        return $request->user()->addresses()->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'=>'required|string|max:255',
            'phone'=>'required|string|max:20',
            'line1'=>'required|string|max:255',
            'line2'=>'nullable|string|max:255',
            'city'=>'required|string|max:100',
            'state'=>'required|string|max:100',
            'postal_code'=>'required|string|max:20',
            'country'=>'required|string|max:100',
            'is_default'=>'boolean'
        ]);
        if (($data['is_default'] ?? false) === true) {
            $request->user()->addresses()->update(['is_default'=>false]);
        }
        $addr = $request->user()->addresses()->create($data);
        return response()->json($addr, 201);
    }

    public function show(Address $address)
    {
        $this->authorize('view', $address);
        return $address;
    }

    public function update(Request $request, Address $address)
    {
        $this->authorize('update', $address);
        $data = $request->validate([
            'name'=>'sometimes|string|max:255',
            'phone'=>'sometimes|string|max:20',
            'line1'=>'sometimes|string|max:255',
            'line2'=>'sometimes|string|max:255|nullable',
            'city'=>'sometimes|string|max:100',
            'state'=>'sometimes|string|max:100',
            'postal_code'=>'sometimes|string|max:20',
            'country'=>'sometimes|string|max:100',
            'is_default'=>'sometimes|boolean'
        ]);
        if (($data['is_default'] ?? false) === true) {
            $request->user()->addresses()->update(['is_default'=>false]);
        }
        $address->update($data);
        return $address;
    }

    public function destroy(Address $address)
    {
        $this->authorize('delete', $address);
        $address->delete();
        return response()->noContent();
    }
}

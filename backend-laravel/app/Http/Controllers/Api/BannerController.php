<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Banner;

class BannerController extends Controller
{
    public function index()
    {
        return Banner::where('active', true)->orderBy('position')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'title'=>'required|string|max:255',
            'image_url'=>'required|url',
            'link_url'=>'nullable|url',
            'position'=>'nullable|integer|min:0',
            'active'=>'boolean'
        ]);
        $b = Banner::create($data);
        return response()->json($b, 201);
    }

    public function update(Request $request, Banner $banner)
    {
        $data = $request->validate([
            'title'=>'sometimes|string|max:255',
            'image_url'=>'sometimes|url',
            'link_url'=>'nullable|url',
            'position'=>'nullable|integer|min:0',
            'active'=>'boolean'
        ]);
        $banner->update($data);
        return $banner;
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();
        return response()->noContent();
    }
}

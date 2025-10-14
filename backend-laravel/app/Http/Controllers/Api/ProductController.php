<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $q = Product::query()->with('category');

        if ($search = $request->query('q')) {
            $q->where(function($s) use ($search){
                $s->where('name','like',"%{$search}%")
                  ->orWhere('description','like',"%{$search}%");
            });
        }
        if ($category = $request->query('category')) {
            $q->whereHas('category', fn($c) => $c->where('slug', $category));
        }
        if ($sort = $request->query('sort')) {
            if ($sort === 'price_asc') $q->orderBy('price','asc');
            if ($sort === 'price_desc') $q->orderBy('price','desc');
            if ($sort === 'newest') $q->latest();
        } else {
            $q->latest();
        }

        return $q->paginate(12);
    }

    public function show(Product $product)
    {
        $product->load('category', 'reviews.user');
        return $product;
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'category_id' => 'nullable|integer|exists:categories,id',
            'images' => 'array',
        ]);
        $data['slug'] = $data['slug'] ?? Str::slug($data['name']).'-'.Str::random(4);
        $product = Product::create($data);
        return response()->json($product, 201);
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'name' => 'sometimes|string|max:255',
            'slug' => 'sometimes|string|max:255',
            'description' => 'sometimes|string|nullable',
            'price' => 'sometimes|numeric|min:0',
            'stock' => 'sometimes|integer|min:0',
            'category_id' => 'sometimes|integer|exists:categories,id',
            'images' => 'sometimes|array',
            'status' => 'sometimes|string|in:draft,published,archived'
        ]);
        $product->update($data);
        return $product;
    }

    public function destroy(Product $product)
    {
        $product->delete();
        return response()->noContent();
    }
}

<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\{User, Category, Product, Coupon, Banner};

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => 'password',
            'is_admin' => true,
        ]);

        $cat = Category::create(['name'=>'Shoes','slug'=>'shoes']);
        $cat2 = Category::create(['name'=>'Watches','slug'=>'watches']);

        Product::create(['name'=>'Runner Pro', 'slug'=>'runner-pro', 'price'=>3999, 'stock'=>50, 'category_id'=>$cat->id, 'images'=>['/img/runner.jpg']]);
        Product::create(['name'=>'Trail X', 'slug'=>'trail-x', 'price'=>4999, 'stock'=>30, 'category_id'=>$cat->id, 'images'=>['/img/trail.jpg']]);
        Product::create(['name'=>'Quartz Silver', 'slug'=>'quartz-silver', 'price'=>6999, 'stock'=>20, 'category_id'=>$cat2->id, 'images'=>['/img/quartz.jpg']]);

        Coupon::create(['code'=>'WELCOME10','type'=>'percent','value'=>10,'active'=>true]);
        Banner::create(['title'=>'Big Sale','image_url'=>'https://picsum.photos/1200/400','link_url'=>'/sale','position'=>1, 'active'=>true]);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id','order_id','provider',
        'provider_order_id','provider_payment_id','provider_signature',
        'amount','currency','status','payload','meta'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payload' => 'array',
        'meta' => 'array',
    ];

    public function order() { return $this->belongsTo(Order::class); }
    public function user() { return $this->belongsTo(User::class); }
}

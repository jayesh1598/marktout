<?php

namespace App\Policies;

use App\Models\{User, Order};

class OrderPolicy
{
    public function view(User $user, Order $order) { return $order->user_id === $user->id; }
}

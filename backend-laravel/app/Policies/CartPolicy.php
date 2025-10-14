<?php

namespace App\Policies;

use App\Models\{User, Cart};

class CartPolicy
{
    public function update(User $user, Cart $cart) { return $cart->user_id === $user->id; }
}

<?php

namespace App\Policies;

use App\Models\{User, Address};

class AddressPolicy
{
    public function view(User $user, Address $address) { return $address->user_id === $user->id; }
    public function update(User $user, Address $address) { return $address->user_id === $user->id; }
    public function delete(User $user, Address $address) { return $address->user_id === $user->id; }
}

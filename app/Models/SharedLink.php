<?php

namespace App\Models;

use App\Models\User;
use App\Models\ShoppingList;
use Illuminate\Database\Eloquent\Model;

class SharedLink extends Model {
    protected $fillable = [
        'list_id',
        'user_id',
        'token',
    ];

    // Relationship with shopping list
    public function shoppingList() {
        return $this->belongsTo(ShoppingList::class, 'id');
    }

    // Relationship with user
    public function user() {
        return $this->belongsTo(User::class);
    }
}

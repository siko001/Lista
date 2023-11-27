<?php

namespace App\Models;

use App\Models\Product;
use App\Models\SharedLink;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ShoppingList extends Model {
    use HasFactory;

    protected $fillable = [
        'name',
        "user_id"
    ];

    public function products() {
        return $this->hasMany(Product::class);
    }

    // In the ShoppingList model
    public function users() {
        return $this->belongsToMany(User::class, 'shopping_list_user');
    }

    // Relationship with shared_links
    public function shared_links() {
        return $this->hasMany(SharedLink::class);
    }
}

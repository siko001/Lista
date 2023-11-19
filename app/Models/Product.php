<?php

namespace App\Models;

use App\Models\ShoppingList;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model {
    protected $fillable = [
        'name',
        "unique_key",
        'list_id',
        'category',
        'quantity',
        'unit',
        'price',
        "status",
        "user_id",
        "guest_id"
    ];

    public function list() {
        return $this->belongsTo(ShoppingList::class);
    }
}

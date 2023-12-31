<?php

namespace App\Models;

use App\Models\ShoppingList;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model {
    protected $fillable = [
        'name',
        "uniqueKey",
        'list_id',
        'category',
        'quantity',
        'unit',
        'price',
        "status",
        "user_id",
        "guest_id"
    ];

    protected $casts = [
        "name" => "json",
        "category" => "json"
    ];

    public function list() {
        return $this->belongsTo(ShoppingList::class);
    }
}

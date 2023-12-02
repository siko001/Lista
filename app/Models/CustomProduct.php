<?php

namespace App\Models;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CustomProduct extends Model {
    protected $fillable = [
        'name',
        "uniqueKey",
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

    public function user() {
        return $this->belongsTo(User::class);
    }
}

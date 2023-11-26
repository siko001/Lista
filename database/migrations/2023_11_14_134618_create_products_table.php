<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->integer("uniqueKey");
            $table->json('name');
            $table->unsignedBigInteger('list_id');
            $table->json("category");
            $table->integer("quantity")->nullable();
            $table->string("unit")->nullable()->default("KG");
            $table->integer("price")->nullable()->default();
            $table->integer("user_id")->nullable();
            $table->integer("guest_id")->nullable();
            $table->enum("status", ["to buy", "ready"])->default("to buy");
            $table->timestamps();
            $table->foreign('list_id')->references('id')->on('shopping_lists')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('products');
    }
};

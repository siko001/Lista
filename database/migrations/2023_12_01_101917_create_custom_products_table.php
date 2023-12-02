<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('custom_products', function (Blueprint $table) {
            $table->id();
            $table->integer("uniqueKey");
            $table->json('name');
            $table->json("category")->nullable();
            $table->integer("quantity")->nullable();
            $table->string("unit")->nullable()->default("KG");
            $table->integer("price")->nullable()->default();
            $table->unsignedBigInteger("user_id")->nullable();
            $table->unsignedBigInteger("guest_id")->nullable();
            $table->enum("status", ["to buy", "ready"])->default("to buy");
            $table->string("custom")->default(true);
            $table->timestamps();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('custom_products');
    }
};

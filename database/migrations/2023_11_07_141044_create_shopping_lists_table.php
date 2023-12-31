<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void {
        Schema::create('shopping_lists', function (Blueprint $table) {
            $table->id();
            $table->timestamps();
            $table->string("name")->nullable();
            $table->integer("totalProductCount")->default(0);
            $table->integer("totalReadyProducts")->default(0)->nullable();
            $table->string("shared")->default(false);
            $table->string("link_url")->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void {
        Schema::dropIfExists('shopping_list_user');
        Schema::dropIfExists('shopping_lists');
    }
};

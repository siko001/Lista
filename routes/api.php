<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ListController;
use App\Http\Controllers\Api\ProductController;

Route::middleware(['auth:sanctum'])->group(function () {
    // Define the routes that require authentication here

});


// CRUD for the lists
Route::post("/create-list", [ListController::class, "createList"]);
Route::get("/get-lists", [ListController::class, "getAllLists"]);
Route::put("/update-list-title/{id}", [ListController::class, "updateListTitle"]);
Route::delete("list/delete/{id}", [ListController::class, "deleteList"]);
Route::post("list/copy/{id}", [ListController::class, "copyList"]);



// View for the List
Route::get("/{name}/{id}", [ListController::class, "viewTheList"]);

//CRUD for the producrts
Route::post("/add-product/{name}", [ProductController::class, "addProduct"]);
Route::delete("remove-product/{productId}/{listId} ", [ProductController::class, "removeProduct"]);
Route::delete("empty-list/{id}", [ProductController::class, "removeAllProducts"]);
Route::put("/update/product{id}/{listId}", [ProductController::class, "markProductReady"]);

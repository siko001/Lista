<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ListController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\SharedLinkController;
use App\Http\Controllers\Api\CustomProductController;




//Custom Products Routes
Route::get("/custom-products/{userId}", [CustomProductController::class, "getAllUserCustomProducts"]);

Route::delete("/delete-myProduct/{productId}/{userId}", [CustomProductController::class, "deleteCustomProduct"]);

Route::put("/update-myProduct/{productId/{userId}", [CustomProductController::class, "updateCustomProduct"]);
Route::post("/create-myProduct/{userId}", [CustomProductController::class, "createCustomProduct"]);



// Sharing the List Routes
// Generation of link
Route::post("/share-list", [SharedLinkController::class, "generateShareableLink"]);
//Activation of the link
Route::get('/shared-links/{token}/{id}', [SharedLinkController::class, 'activateLink']);


//User Related Rourtes
Route::get("/user/{id}", [UserController::class, "getUser"]);



// CRUD for the lists Routes
Route::post("/create-list", [ListController::class, "createList"]);
Route::get("/get-lists/{id}", [ListController::class, "getAllLists"]);
Route::put("/update-list-title/{id}", [ListController::class, "updateListTitle"]);
Route::delete("list/delete/{id}", [ListController::class, "deleteList"]);
Route::post("list/copy/{id}/{userID}", [ListController::class, "copyList"]);

// View for the List for the user
Route::get("/{name}/{id}", [ListController::class, "viewTheList"]);


//CRUD for the standard products
Route::post("/add-product/{name}/{userId}", [ProductController::class, "addProduct"]);
Route::delete("remove-product/{productId}/{listId} ", [ProductController::class, "removeProduct"]);
Route::delete("empty-list/{id}", [ProductController::class, "removeAllProducts"]);
Route::put("/update/product{id}/{listId}/{userId}", [ProductController::class, "markProductReady"]);
Route::put("/update/all-ready/{listId}", [ProductController::class, "markAllAsReady"]);
Route::put('update/all-to_buy/{listId}', [ProductController::class, "markAllToBuy"]);
Route::delete("remove/ready/{listId}", [ProductController::class, "removeAllReady"]);
Route::delete("/delete/all-products/and-list{id}", [ProductController::class, "removeListAndCorrispodingProducts"]);
Route::get("/products/count/{id}", [ProductController::class, "getAllCounts"]);
Route::put("/update-product/{listId}/{productId}", [ProductController::class, "updateProductDetails"]);

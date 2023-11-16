<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\ShoppingList;

class ProductController extends Controller {
    public function addProduct(Request $request) {

        $id = $request[0];
        $product = $request[1];


        $list = ShoppingList::where("id", $id)->first();
        $product["list_id"] = $list["id"];


        $product = Product::create([
            "unique_key" => $product["uniqueKey"],
            'name' => $product["name"],
            'category' => $product["category"],
            'list_id' => $product["list_id"],
            'quantity' => $product['quantity'],
            'unit' => $product['unit'],
            'price' => $product['price'],
        ]);
    }

    public function removeProduct($productId, $listId) {
        $product = Product::where("unique_key", $productId)->where("list_id", $listId)->first();
        if ($product) {
            $product->delete();
            return response()->json(['message' => 'Product removed successfully']);
        } else {
            return response()->json(['message' => 'Product not found'], 404);
        }
    }
}

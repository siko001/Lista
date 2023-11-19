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
    public function removeAllProducts($id) {
        $allProductsInList = Product::where("list_id", $id)->get();

        if ($allProductsInList->isNotEmpty()) {
            foreach ($allProductsInList as $product) {
                $product->delete();
            }

            return response()->json(["message" => "Products emptied"]);
        } else {
            return response()->json(["message" => "No products found in the list"]);
        }
    }


    public function markProductReady($productID, $listID) {
        $product = Product::where("unique_key", $productID)->where("list_id", $listID)->first();
        if ($product) {
            if ($product->status == "to buy") {
                $product->status = "ready";
                $product->update();
                return response(["message" => "Product Marked as ready"], 200);
            } else {
                return response(["message" => "Product already marked as Ready"], 400);
            }
        } else {
            return response(["message" => "no product found"], 404);
        }
    }
}

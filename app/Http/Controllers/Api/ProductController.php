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
            "uniqueKey" => $product["uniqueKey"],
            'name' => $product["name"],
            'category' => $product["category"],
            'list_id' => $product["list_id"],
            'quantity' => $product['quantity'],
            'unit' => $product['unit'],
            'price' => $product['price'],
        ]);
    }

    public function removeProduct($productId, $listId) {
        $product = Product::where("uniqueKey", $productId)->where("list_id", $listId)->first();
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
        $product = Product::where("uniqueKey", $productID)->where("list_id", $listID)->first();
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

    //function to move all NOT ready products to the Readu products array

    public function markAllAsReady($id) {
        $products = Product::where("list_id", $id)->where("status", "to buy")->get();
        if ($products) {
            foreach ($products as $product) {
                $product->status = "ready";
                $product->update();
            }

            return response(["message" => "Prodcuts Have Been Updated"], 200);
        } else
            return response(["message" => "No Products In the List"], 404);
    }


    //Funtion To Move all ready products To NOT Ready
    public function markAllToBuy($id) {
        $products = Product::where("list_id", $id)->where("status", "ready")->get();
        if ($products) {
            foreach ($products as $product) {
                $product->status = "to buy";
                $product->update();
            }
            return response(["message" => "Prodcuts Have Been Updated"], 200);
        } else
            return response(["message" => "No Products In the List"], 404);
    }


    public function removeAllReady($id) {
        $products = Product::where("list_id", $id)->where("status", "ready")->get();
        if ($products) {
            foreach ($products as $product) {
                $product->delete();
            }
            return response(["message" => "Prodcuts Removed"], 200);
        } else
            return response(["message" => "No Products In the List"], 404);
    }

    public function removeListAndCorrispodingProducts($id) {
        $products = Product::where("list_id", $id)->get();

        $list = ShoppingList::where("id", $id)->first();

        if ($list) {
            if ($products) {
                foreach ($products as $product) {
                    $product->delete();
                }
                $list->delete();
                return response(["message" => "Products and List were deleted Successfully"], 200);
            } else {
                $list->delete();
                return response(["message" => "List was deleted Successfully but no products found inside the list" . $id], 200);
            }
        } else {
            return response(["message" => "List Not Found"], 400);
        }
    }
}

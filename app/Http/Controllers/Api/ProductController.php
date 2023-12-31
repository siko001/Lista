<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Events\AddProduct;
use App\Models\ShoppingList;
use Illuminate\Http\Request;
use App\Events\DeleteProduct;
use App\Events\MarkProductReady;
use App\Events\RemoveAllProducts;
use App\Events\MarkAllProductReady;
use App\Http\Controllers\Controller;
use App\Events\DeleteProductShouldBroadcast;

class ProductController extends Controller {

    // ADD PRODUCT TO TOTAL LIST
    private function addToListTotalproduct($list) {
        $list->totalProductCount += 1;
        $list->save();
    }

    // ADD READY PRODUCT TO REEADY LIST
    private function addToReadyListTotalproduct($list) {
        $list->totalReadyProducts = $list->totalReadyProducts + 1;
        $list->save();
    }

    // REMOVE FROM READY PRODUCT TO REEADY LIST
    private function removeFromReadyListTotalproduct($list) {
        $list->totalReadyProducts =  $list->totalReadyProducts - 1;
        $list->save();
    }

    // REMOVE PRODUCT From TOTAL LIST
    private function removeFromListTotal($list) {
        $list->totalProductCount = $list->totalProductCount - 1;
        $list->save();
    }

    // All Products and Ready products The Same
    private function moveProductsToReady($list) {
        $list->totalReadyProducts = $list->totalProductCount;
        $list->save();
    }


    // Empty Ready Products But Keep all Products
    private function emptyReadyProducts($list) {
        $list->totalReadyProducts = 0;
        $list->save();
    }

    private function parallelEmpty($list) {
        info($list);
        $totalReadyProductsToRemove = $list->totalReadyProducts;
        info("total to remove: " . $totalReadyProductsToRemove);
        $totalList = $list->totalProductCount;
        info("total List:" . $totalList);
        $updatedTotalList = $totalList - $totalReadyProductsToRemove;
        info("updated total : " . $updatedTotalList);
        $list->totalProductCount = $updatedTotalList;
        $list->totalReadyProducts = 0;
        $list->save();
    }

    // Function to add a product to the to buy list
    public function addProduct(Request $request, $productName, $userId) {
        $id = $request[0];
        $product = $request[1];
        $list = ShoppingList::where("id", $id)->first();
        info($userId);
        $product["list_id"] = $list["id"];

        //if The Product is Found
        if ($product) {

            //if the product is shared
            if ($list->shared == true) {
                event(new AddProduct($product["list_id"], $userId, $product, $list));
            }

            $this->addToListTotalproduct($list);
            $product = Product::create([
                "uniqueKey" => $product["uniqueKey"],
                'name' => ["en" => $product["name"]["en"], "mt" => $product["name"]["mt"]],
                'category' => ["en" => $product["category"]["en"], "mt" => $product["category"]["mt"]],
                'list_id' => $product["list_id"],
                'quantity' => $product['quantity'],
                'unit' => $product['unit'],
                'price' => $product['price'],
            ]);
        }
    }



    //Function to remove 1 Product from the to List
    public function removeProduct($productId, $listId) {
        $product = Product::where("uniqueKey", $productId)->where("list_id", $listId)->first();
        $list = ShoppingList::where("id", $listId)->first();
        if ($product) {

            //if the product is shared
            if ($list->shared == true) {
                event(new DeleteProduct($product, $list));
            }


            if ($product->status == "to buy") {
                $this->removeFromListTotal($list);
            } else {
                $this->removeFromListTotal($list);
                $this->removeFromReadyListTotalproduct($list);
            }
            $product->delete();
            return response()->json(['message' => 'Product removed successfully']);
        } else {
            return response()->json(['message' => 'Product not found'], 404);
        }
    }


    // Function to remove all Products from the list
    public function removeAllProducts($id) {
        $list = ShoppingList::where("id", $id)->first();
        $allProductsInList = Product::where("list_id", $id)->get();
        if ($allProductsInList->isNotEmpty()) {
            if ($list->shared == true) {
                event(new RemoveAllProducts($list));
            }
            foreach ($allProductsInList as $product) {
                $product->delete();
            }
            $list->totalProductCount = 0;
            $list->totalReadyProducts = 0;
            $list->save();

            return response()->json(["message" => "Products emptied"]);
        } else {
            return response()->json(["message" => "No products found in the list"]);
        }
    }


    // Function to mark ONE product as ready
    public function markProductReady($productID, $listID, $userId) {
        $list = ShoppingList::where("id", $listID)->first();
        $product = Product::where("uniqueKey", $productID)->where("list_id", $listID)->first();
        if ($product) {

            if ($list->shared == true) {
                event(new MarkProductReady($productID, $userId, $product, $list));
            }

            $this->addToReadyListTotalproduct($list);
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



    //function to move ALL to buy products to the Ready products array
    public function markAllAsReady($id) {
        $list = ShoppingList::where("id", $id)->first();
        $products = Product::where("list_id", $id)->where("status", "to buy")->get();
        if ($products) {
            if ($list->shared == true) {
                event(new MarkAllProductReady($list));
            }
            $this->moveProductsToReady($list);
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
        $list = ShoppingList::where("id", $id)->first();
        $products = Product::where("list_id", $id)->where("status", "ready")->get();
        if ($products) {
            if ($list->shared == true) {
                event(new MarkAllProductReady($list));
            }
            $this->emptyReadyProducts($list);
            foreach ($products as $product) {
                $product->status = "to buy";
                $product->update();
            }
            return response(["message" => "Prodcuts Have Been Updated"], 200);
        } else
            return response(["message" => "No Products In the List"], 404);
    }



    // Function To Remove all Ready Products
    public function removeAllReady($id) {
        $list = ShoppingList::where("id", $id)->first();
        $products = Product::where("list_id", $id)->where("status", "ready")->get();
        if ($products) {
            if ($list->shared == true) {
                event(new MarkAllProductReady($list));
            }
            $this->parallelEmpty($list);
            info("parallel");
            info("removed");
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
            if ($list->shared == true) {
                event(new MarkAllProductReady($list));
            }
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

    public function updateProductDetails($listId, $productId, Request  $request) {
        $list = ShoppingList::where("id", $listId)->first();


        $product = Product::where("uniqueKey", $productId)->where("list_id", $listId)->first();

        if ($list->shared == true) {
            event(new MarkAllProductReady($list));
        }
        if ($product) {

            // Update the product fields
            $product->name = [
                'en' => $request->input('nameEN'),
                'mt' => $request->input('nameMT'),
            ];
            $product->category = [
                'en' => $request->input('categoryEN'),
                'mt' => $request->input('categoryMT'),
            ];

            $product->quantity = $request->input('quantity');
            $product->price = $request->input('price');
            $new =     $product->unit = $request->input("unit");
            info($new);
            $product->update();
        }
    }
}

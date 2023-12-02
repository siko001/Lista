<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CustomProduct;
use App\Models\ShoppingList;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CustomProductController extends Controller {

    public function getAllUserCustomProducts($userId) {
        $allCustomProducts = CustomProduct::where("user_id", $userId)->get();

        if ($allCustomProducts) {
            return response($allCustomProducts, 200);
        } else {
            return response(["message" => "No Custom Products for user"], 200);
        }
    }



    private function checkForUser($userId) {
        $user = User::where("id", $userId)->first();
        if (!$user) {
            return response(["message" => "User Not Found"], 404);
        }
        return $user;
    }

    private function checkForCustomProduct($productId) {
        info($productId);
        $customProduct = CustomProduct::where("uniqueKey", $productId)->first();
        if (!$customProduct) {
            return response(["message" => "No Product Was Found"], 404);
        }
        return $customProduct;
    }

    private function checkForList($listId) {
        $list = ShoppingList::where("id", $listId)->first();
        if (!$list) {
            return response(["message" => "Error, List not found"], 404);
        }
        return $list;
    }



    public function createCustomProduct($userId, Request $request) {
        $this->checkForUser($userId);
        $randomID = rand(100000, 999999);
        $newproduct =  $request;
        if ($newproduct) {
            if ($request->input("nameMt")) {
                info("creating maltese");
                info($newproduct);
                CustomProduct::create([
                    "name" => ["en" => "", "mt" => $newproduct["nameMt"]],
                    "category" => ["en" => "", "mt" => ""],
                    "uniqueKey" => $randomID,
                    "user_id" => $userId,
                ]);
                return response(["message" => "product created"], 200);
            } else {
                info("creating english");
                info($request);
                CustomProduct::create([
                    "name" => ["en" => $newproduct["nameEn"], "mt" => ""],
                    "category" => ["en" => "", "mt" => ""],
                    "uniqueKey" => $randomID,
                    "user_id" => $userId,
                ]);
                return response(["message" => "product created in english"], 200);
            }
        } else {
            return response(["message" => "Error creating product"], 404);
        }
    }

    public function deleteCustomProduct($productId, $userId) {
        $this->checkForUser($userId);
        //if a product is found the return of this function will the product
        $customProductToDelete = $this->checkForCustomProduct($productId);
        info($customProductToDelete);
        $customProductToDelete->delete();
        return response(["message" => "Custom Product Was Deleted Successfully"], 200);
    }



    //continue this function over here 
    public function updateCustomProduct($productId, $userId, Request $request) {
        $this->checkForUser($userId);
        $productToUpdate = $this->checkForCustomProduct($productId);
        if ($request->input("nameEn")) {
            $updatedProduct =   $request->validate([]);
            if ($updatedProduct) {
                $productToUpdate->update([]);
            } else {
                return response(["message" => "Fields Missing"], 422);
            }
        } else if ($request->input("nameMt")) {
            $updatedProduct =   $request->validate([]);
            if ($updatedProduct) {
                $productToUpdate->update([]);
            } else {
                return response(["message" => "Fields Missing"], 422);
            }
        } else {
            return response(["message" => "Name for Product is required"], 422);
        }
    }







    //     //Continue These Functions below here maybe create a pivot table between list custom product
    //     public function addCustomProductToList($userId, $listId, $productId) {
    //         $customProduct =  $this->checkForCustomProduct($productId);
    //         $list =   $this->checkForList($listId);
    //         $this->checkForUser($userId);
    //     }

    //     public function removeCustomProductFromList($userId, $listId, $productId) {
    //         $customProduct =  $this->checkForCustomProduct($productId);
    //         $list =   $this->checkForList($listId);
    //         $this->checkForUser($userId);
    //     }
    //     public function updateTheCustomProductInTheSpecificList($userId, $listId, $productId, Request $request) {
    //         $customProduct = $this->checkForCustomProduct($productId);
    //         $list =  $this->checkForList($listId);
    //         $this->checkForUser($userId);
    //         if ($request->input("nameEn")) {

    //             $updatedCustomProduct =  $request->validate([]);
    //         } else if ($request->input("nameMt")) {

    //             $updatedCustomProduct =  $request->validate([]);
    //         } else {
    //             return response(["message" => "Name is Required"], 422);
    //         }
    //     }
}
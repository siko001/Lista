<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Models\ShoppingList;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\SharedLink;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ListController extends Controller {

    //Creates a List from the Name User Inputted and Saves it to db, also saves it in local storage as an object.. the list gets assiged a user Guest or not
    public function createList(Request $request) {
        $userId = $request["ID"];
        $user = User::find($userId);

        $list = $request->validate([
            "listName" => "required|min:3|max:30"
        ]);
        if ($list) {
            $listObject =  ShoppingList::create(
                ["name" => $list['listName']]
            );
            $user->shoppingLists()->attach($listObject->id);
            return response($listObject, 200);
        }
    }


    // Function to get all lists related to that user
    public function getAllLists($id) {
        $user = User::find($id);
        if (!$user) {
            return response(['error' => 'User not found'], 404);
        }
        // Get all lists associated with the user
        $lists = $user->shoppingLists;
        return response($lists, 200);
    }


    // Function to Update the List title
    public function updateListTitle($id, Request $request) {
        $list = ShoppingList::find($id);
        if ($request->has('title')) {
            $list->name = $request->input('title');
        } else {
            $list->name = "List " . $id;
        }
        $list->save();
    }


    // Function to delete the list and it's corrisponding products
    public function deleteList($id) {
        $listToDelete = ShoppingList::find($id);
        if ($listToDelete) {
            $productsToDelete = Product::where("list_id", $id)->get();
            // Delete associated products
            foreach ($productsToDelete as $product) {
                $product->delete();
            }
            // Delete the List
            $listToDelete->delete();
            return response()->json(['message' => 'List and associated products deleted successfully'], 200);
        } else {
            return response()->json(['error' => 'List not found'], 404);
        }
    }


    //Function to Copy The Whole List Relarted to the user and keep the same products
    public function copyList($id, $userId) {
        $listToCopy = ShoppingList::find($id);

        if ($listToCopy) {
            $products = Product::where("list_id", $id)->get();
            $copiedList = ShoppingList::create([
                "name" => $listToCopy["name"],
            ]);

            $copiedList->users()->attach($userId);
            $count = 0;
            $readyProducts = 0;
            foreach ($products as $product) {
                if ($product->status == "ready") {
                    $readyProducts++;
                }
                $product = Product::create([
                    "uniqueKey" => $product["uniqueKey"],
                    'name' => ["en" => $product["name"]["en"], "mt" => $product["name"]["mt"]],
                    'category' => ["en" => $product["category"]["en"], "mt" => $product["category"]["mt"]],
                    'list_id' => $copiedList["id"],
                    "status" => $product["status"],
                    'quantity' => $product['quantity'],
                    'unit' => $product['unit'],
                    'price' => $product['price'],
                ]);
                $count++;
            }
            if ($readyProducts !== 0) {
                $copiedList->totalReadyProducts = $readyProducts;
            }

            $copiedList->totalProductCount = $count;
            $copiedList->save();
            return response($copiedList, 200);
        } else {
            return response(["message" => "List doesnt exist"], 404);
        }
    }


    // Function to get the lists
    public function viewTheList($listName, $id) {
        $listdetails = ShoppingList::find($id);
        if (!$listdetails) {
            // Handle the case where the list with the given ID is not found
            return response(['error' => 'List not found'], 404);
        }
        $Products = Product::where("list_id", $id)->get();
        $toBuy = $Products->where("status", "to buy");
        $ready = $Products->where("status", "!=", "to buy");
        return response([$listdetails, $Products, $toBuy, $ready]);
    }


// // Function to Create
//     public function shareTheList(Request $request) {
//         // Validate request data
//         $request->validate([
//             'listId' => 'required|exists:shopping_lists,id',
//             'userId' => 'required|exists:users,id',
//         ]);
//         // Check if the authenticated user owns the list
//         $list = ShoppingList::findOrFail($request->listId);
//         if ($list->user_id !== auth()->id()) {
//             return response(['error' => 'Unauthorized'], 401);
//         }

//         // Attach the user to the shopping list
//         $list->users()->attach($request->userId);

//         return response(['message' => 'List shared successfully']);
//     }



//     public function AddSharedList($id) {
//         $sharedLink = SharedLink::where("token", $id)->first();

//         if (!$sharedLink) {
//             return response(['error' => 'List not found'], 404);
//         }
//         $listId = $sharedLink["shopping_list_id"];
//     }
}

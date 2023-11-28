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



    public function getAllLists($id) {
        // Find the user by ID
        $user = User::find($id);

        if (!$user) {
            return response(['error' => 'User not found'], 404);
        }

        // Get all lists associated with the user
        $lists = $user->shoppingLists;
        return response($lists, 200);
    }



    public function updateListTitle($id, Request $request) {
        $list = ShoppingList::find($id);
        if ($request->has('title')) {
            $list->name = $request->input('title');
        } else {
            $list->name = "List " . $id;
        }
        $list->save();
    }
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


    public function copyList($id) {
        $listToCopy = ShoppingList::find($id);
        if ($listToCopy) {
            $copiedList = ShoppingList::create(["name" => $listToCopy["name"]]);
            return response($copiedList, 200);
        } else {
            return response(["message" => "List doesnt exist"], 404);
        }
    }

    public function viewTheList($listName, $id) {
        $listdetails = ShoppingList::find($id);

        if (!$listdetails) {
            // Handle the case where the list with the given ID is not found
            return response(['error' => 'List not found'], 404);
        }

        $Products = Product::where("list_id", $id)->get();

        return response([$listdetails, $Products]);
    }



    public function shareTheList(Request $request) {

        // Validate request data
        $request->validate([
            'listId' => 'required|exists:shopping_lists,id',
            'userId' => 'required|exists:users,id',
        ]);

        // Check if the authenticated user owns the list
        $list = ShoppingList::findOrFail($request->listId);
        if ($list->user_id !== auth()->id()) {
            return response(['error' => 'Unauthorized'], 401);
        }

        // Attach the user to the shopping list
        $list->users()->attach($request->userId);

        return response(['message' => 'List shared successfully']);
    }



    public function AddSharedList($id) {
        $sharedLink = SharedLink::where("token", $id)->first();

        if (!$sharedLink) {
            return response(['error' => 'List not found'], 404);
        }

        $listId = $sharedLink["shopping_list_id"];
    }
}

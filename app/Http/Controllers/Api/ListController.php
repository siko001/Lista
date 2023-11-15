<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ShoppingList;
use Illuminate\Http\Request;

class ListController extends Controller {

    //Creates a List from the Name User Inputted and Saves it to db, also saves it in local storage as an object
    public function createList(Request $request) {
        $list = $request->validate([
            "listName" => "required|min:3|max:30"
        ]);
        if ($list) {
            $listObject =  ShoppingList::create(["name" => $list['listName']]);
            return response($listObject, 200);
        }
    }

    public function getAllLists() {
        $lists =   ShoppingList::all();
        return $lists;
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

            // Delete the list
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
        $listdetails = ShoppingList::find($id)->get();
        $Products = Product::where("list_id", $id)->get();

        return response([$listdetails, $Products]);
    }
}

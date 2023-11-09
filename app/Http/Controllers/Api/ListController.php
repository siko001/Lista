<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ShoppingList;
use Illuminate\Http\Request;

class ListController extends Controller {
    public function createList(Request $request) {
        $list = $request->validate([
            "listName" => "required|min:3|max:30"
        ]);
        if ($list) {
            ShoppingList::create(["name" => $list['listName']]);
            return response(["message" => "List created Successfully"], 200);
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
        info($id);
        $listToDelete = ShoppingList::find($id);
        info("List to delete: " . $listToDelete);

        if ($listToDelete) {
            $listToDelete->delete();
            return response()->json(['message' => 'List deleted successfully'], 200);
        } else {
            return response()->json(['error' => 'List not found'], 404);
        }
    }

    public function copyList($id) {
        $listToCopy = ShoppingList::find($id);
        if ($listToCopy) {
            ShoppingList::create(["name" => $listToCopy["name"]]);
            return response(["message" => "List Copied"], 200);
        } else {
            return response(["message" => "List doesnt exist"], 404);
        }
    }
}

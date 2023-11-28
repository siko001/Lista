<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\SharedLink;
use Illuminate\Support\Str;
use App\Models\ShoppingList;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class SharedLinkController extends Controller {

    //When the user Clicks the link copies the list to his name
    public function activateLink($token, $id) {
        //
        $link = SharedLink::where('token', $token)->first();

        if (!$link) {
            return response()->json(['error' => 'Invalid link'], 404);
        }
        // Retrieve shopping list and user information
        // UserThat Sent The List
        $userId = $link->user_id;
        $shoppingListId = $link->shopping_list_id;

        // Implement logic to copy shopping list and update pivot table
        // User That is RECIEVING THE LIST
        $user = User::find($id);
        $originalShoppingList = ShoppingList::find($shoppingListId);
        if (!$originalShoppingList) {
            return response()->json(['error' => 'Shopping list not found'], 404);
        }
        $user->shoppingLists()->attach($originalShoppingList->id);

        $link->delete();
        return response()->json(['message' => 'Link activated successfully']);
    }



    public function generateShareableLink(Request $request) {
        info($request);
        // Validate request data
        $request->validate([
            'listId' => 'required|exists:shopping_lists,id',
        ]);


        // Check if the authenticated user owns the list
        $list = ShoppingList::findOrFail($request->listId);

        if (!$list->users()->where("user_id", $request["userId"])->exists()) {
            return response(['error' => 'Unauthorized'], 401);
        }

        // Generate a unique token for the shared link
        $token = Str::uuid()->toString();
        // Associate the token with the list and user
        $list->shared_links()->create([
            'token' => $token,
            'user_id' => $request["userId"],
        ]);

        // Return the generated link
        $link = "http://localhost:5000/shared-list/$token";
        info($link);
        return response(['link' => $link]);
    }
}

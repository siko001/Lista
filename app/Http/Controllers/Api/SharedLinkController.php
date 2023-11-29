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
        $link = SharedLink::where('token', $token)->first();
        $originalList = ShoppingList::where("id", $link->shopping_list_id)->first();
        //If the Link is not in the db
        if (!$link) {
            return response()->json(['error' => 'Invalid link'], 404);
        }
        // Check if the user clicking the link is the same as the user who sent the link
        if ($link->user_id == $id) {
            return response()->json(['error' => 'You cannot activate a link sent by yourself'], 400);
        }


        // Check if the user has already activated the link
        $alreadyActivated = $originalList->users()->where('user_id', $id)->exists();

        if ($alreadyActivated) {
            info("Already activated by this user");
            return response()->json(['error' => 'Link has already been activated by this user'], 400);
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
        return response()->json(['message' => 'Link activated successfully']);
    }



    public function generateShareableLink(Request $request) {
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
        return response(['link' => $link]);
    }
}

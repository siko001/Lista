<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class UserController extends Controller {


    public function getUser($id) {
        $user = User::find($id);
        if (!$user) {
            // If the user doesn't exist, create a new user
            $user = User::create([
                "id" => $id,
                'name' => 'Guest',
                'email' => 'guest' . $id . '@lista.com',
                'password' => bcrypt('password'),
                'is_guest' => true,
            ]);
            info("created new user");
            // Associate the new user with the access token
            auth()->login($user);
        }



        return response(['user' => $user], 200);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller {


    public function getUser($id) {
        $user = User::find($id);
        info($user);
        if (!$user) {
            // If the user doesn't exist, create a new user
            $user = User::create([
                "id" => $id,
                'name' => 'Guest',
                'email' => 'guest' . $id . '@lista.com',
                'password' => bcrypt('password'),
                'is_guest' => "true",
            ]);
            info("created new user");
            // Associate the new user with the access token
            auth()->login($user);
        }
        info("found User");
        return response(['user' => $user], 200);
    }


    public function checkEmailAvaliabilty(Request $request) {
        $emailToCheck = $request["email"];
        $alreadyRegisterEmail = User::where("email", $emailToCheck)->first();
        if (!$alreadyRegisterEmail) {
            return response(["message" => "Email Is Avaliable"], 200);
        } else {
            return response(["message" => "Email Is Taken"], 200);
        }
    }


    public function registerUser($userid, Request $request) {
        $userDetails = $request->validate([
            "name" => "required|min:4|max:20",
            "email" => "required|unique:users,email",
            "password" => "required|min:6",
            "passwordConfirmation" => "required|same:password"
        ]);
        $guestAccount = User::where("id", $userid)->first();

        if (!$userDetails) {
            return response(["message" => "Please fill in all the fields"], 422);
        }

        info($userDetails);
        info($guestAccount->is_guest);
        if ($guestAccount->is_guest === "true") {
            $guestAccount->update([
                "id" => $userid,
                "name" => $userDetails["name"],
                "email" => $userDetails["email"],
                "password" => bcrypt($userDetails["password"]),
                "is_guest" => "false"
            ]);
            $guestAccount->save();
            $user = User::where("id", $userid)->first();

            return response(["message" => "Welcome " . $userDetails["name"], $user], 200);
        } else {
            $newUserId = mt_rand(100000, 999999);
            $newUser =    User::create([
                "id" => $newUserId,
                "name" => $userDetails["username"],
                "email" => $userDetails["email"],
                "password" => bcrypt($userDetails["password"]),
                "is_guest" => false
            ]);
            Auth::login($newUser);
            return response(["message" => "new User Created", $newUser], 200);
        }
    }


    public function loginUser(Request $request) {
        info($request);
        $details =   $request->validate([
            "email" => "required",
            "password" => "required",
        ]);

        if (!$details) {
            return response(["message" => "Please fill in all the details"], 422);
            info("details not filled");
        }
        if ($details) {
            $user = User::where("email",  $request["email"])->first();
            if ($user) {
                if (Hash::check($request["password"], $user->password)) {
                    info("correct pass");
                    return response(["message" => "Login successful", "user" => $user], 200);
                } else {
                    info("invalid password");
                    return response(["message" => "Invalid Credentials"], 401);
                }
            } else {
                info("Invalid User");
                return response(["message" => "Invalid Crudentials"], 401);
            }
        }
    }
}

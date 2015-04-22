<?php namespace Kori\Http\Controllers;

use Illuminate\Http\Response;
use Illuminate\Support\Facades\Input;
use Kori\Http\Requests;
use Kori\Http\Requests\UserRequest;
use Kori\User;

class UsersController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth', [
            'except' => 'show'
        ]);

        $this->middleware('admin', [
            'only' => 'index'
        ]);
    }

    /**
     * Display a listing of the users.
     *
     * @return Response
     */
    public function index()
    {
        $users = User::all();

        return view('users.index', compact('users'));
    }

    /**
     * Display the specified user.
     *
     * @param  User $user
     *
     * @return Response
     */
    public function show(User $user)
    {
        return view('users.show', compact('user'));
    }

    /**
     * Show the form for editing the specified user.
     *
     * @param  User $user
     *
     * @return Response
     */
    public function edit(User $user)
    {
        return view('users.edit', compact('user'));
    }

    /**
     * Update the specified user in storage.
     *
     * @param  User $user *
     * @param UserRequest $request
     *
     * @return Response
     */
    public function update(User $user, UserRequest $request)
    {
        $rules['email'] = 'max:255|email|unique:users,email,' . $user->id . ',id';
        $rules['username'] = 'max:255|unique:users,username,' . $user->id . ',id';

        if (Input::hasFile('profilePic')) {
            $image = Input::file('profilePic');
            $picName = $user->username . '.' . $image->guessClientExtension();
            $image->move('profilePics', $picName);
            $user->profilePic = $picName;
        }


        $user->update($request->except('profilePic'));

        return redirect('users/' . $user->username);
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  User $user
     *
     * @return Response
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect('users');
    }
}

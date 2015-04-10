<?php namespace Kori\Http\Controllers;

use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Validator;
use Kori\Http\Requests;
use Kori\Http\Requests\UserRequest;
use Kori\User;

class UsersController extends Controller
{

    /**
     * Display a listing of the users.
     *
     * @return Response
     */
    public function index()
    {
        //
    }

    /**
     * Display the specified user.
     *
     * @param  User $user
     *
     * @return Response
     */
    public function show( User $user )
    {
        return $user;
    }

    /**
     * Show the form for editing the specified user.
     *
     * @param  User $user
     *
     * @return Response
     */
    public function edit( User $user )
    {
        return view( 'users.edit', compact( 'user' ) );
    }

    /**
     * Update the specified user in storage.
     *
     * @param  User       $user *
     * @param UserRequest $request
     *
     * @return Response
     */
    public function update( User $user, UserRequest $request )
    {
        $rules['email'] = 'max:255|email|unique:users,email,' . $user->id . ',id';
        $rules['username'] = 'max:255|unique:users,username,' . $user->id . ',id';

        $user->update( $request->all() );

        return redirect( 'users/' . $user->username );
    }

    /**
     * Remove the specified user from storage.
     *
     * @param  User $user
     *
     * @return Response
     */
    public function destroy( User $user )
    {
        //
    }

}

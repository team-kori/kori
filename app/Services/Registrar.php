<?php namespace Kori\Services;

use Illuminate\Contracts\Auth\Registrar as RegistrarContract;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\Mail;
use Kori\User;
use Validator;

class Registrar implements RegistrarContract
{

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array $data
     *
     * @return \Illuminate\Contracts\Validation\Validator
     */
    public function validator( array $data )
    {
        return Validator::make( $data, [
            'username' => 'required|max:255|unique:users',
            'email'    => 'required|email|max:255|unique:users',
            'password' => 'required|confirmed|min:6',
        ] );
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array $data
     *
     * @return User
     */
    public function create( array $data )
    {
        $confirmation_code = str_random( 30 );

        Mail::send( 'emails.verify', array( 'confirmation_code' => $confirmation_code ), function ( $message ) {
            $message->to( Input::get( 'email' ), Input::get( 'username' ) )
                ->subject( 'Verify your email address' );
        } );

        return User::create( [
            'username'          => $data['username'],
            'email'             => $data['email'],
            'password'          => bcrypt( $data['password'] ),
            'confirmation_code' => $confirmation_code
        ] );
    }

}

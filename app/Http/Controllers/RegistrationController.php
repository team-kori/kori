<?php namespace Kori\Http\Controllers;

use Kori\Http\Requests;
use Kori\Http\Controllers\Controller;

use Illuminate\Http\Request;
use Kori\User;
use Symfony\Component\Security\Core\Exception\InvalidArgumentException;

class RegistrationController extends Controller {

    public function confirm( $confirmation_code )
    {
        if ( !$confirmation_code ) {
            throw new InvalidArgumentException;
        }

        $user = User::whereConfirmationCode( $confirmation_code )->first();

        if ( !$user ) {
            throw new InvalidArgumentException;
        }

        $user->confirmed = 1;
        $user->confirmation_code = null;
        $user->save();

        return redirect( '/' );
    }

}

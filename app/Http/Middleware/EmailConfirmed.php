<?php namespace Kori\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class EmailConfirmed
{

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \Closure $next
     *
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $credentials = [
            'email' => $request['email'],
            'password' => $request['password'],
            'confirmed' => 1
        ];

        if (!Auth::attempt($credentials)) {
            return Redirect::back()
                ->withInput()
                ->withErrors([
                    'credentials' => 'Email is not confirmed.'
                ]);
        }

        return $next($request);
    }
}

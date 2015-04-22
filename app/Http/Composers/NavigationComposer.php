<?php namespace Kori\Http\Composers;

use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;

class NavigationComposer
{
    public function compose(View $view)
    {
        if (Auth::user()) {
            $view->with('user', Auth::user());
        }
    }
}

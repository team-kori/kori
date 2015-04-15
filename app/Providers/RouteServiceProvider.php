<?php namespace Kori\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Routing\Router;
use Kori\User;

class RouteServiceProvider extends ServiceProvider
{

    /**
     * This namespace is applied to the controller routes in your routes file.
     *
     * In addition, it is set as the URL generator's root namespace.
     *
     * @var string
     */
    protected $namespace = 'Kori\Http\Controllers';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @param  \Illuminate\Routing\Router $router
     *
     * @return void
     */
    public function boot( Router $router )
    {
        parent::boot( $router );

        $router->bind( 'users', function ( $username ) {
            return User::whereUsername( $username )->firstOrFail();
        } );
    }

    /**
     * Define the routes for the application.
     *
     * @internal param Router $router
     *
     */
    public function map()
    {
        $this->loadRoutesFrom( app_path( 'Http/routes.php' ) );
    }

}

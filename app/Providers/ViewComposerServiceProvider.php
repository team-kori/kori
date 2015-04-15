<?php namespace Kori\Providers;

use Illuminate\Support\ServiceProvider;

class ViewComposerServiceProvider extends ServiceProvider {

	/**
	 * Bootstrap the application services.
	 *
	 * @return void
	 */
	public function boot()
	{
        $this->composeNavigation();
	}

	/**
	 * Register the application services.
	 *
	 * @return void
	 */
	public function register()
	{
        view()->composer( 'partials.navigation', 'Kori\Http\Composers\NavigationComposer' );
	}

    private function composeNavigation()
    {
    }

}

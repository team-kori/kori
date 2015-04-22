<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

Route::get('/', [
    'as' => 'home',
    'uses' => 'HomeController@index'
]);

Route::resource('users', 'UsersController');
//Route::get( '' );

Route::get('auth/verify/{confirmationCode}', [
    'as' => 'confirmation_path',
    'uses' => 'RegistrationController@confirm'
]);

Route::controllers([
    'auth' => 'Auth\AuthController',
    'password' => 'Auth\PasswordController',
]);

Route::get('migrate', function () {

    echo '<br>init with Migrate tables ...';
    Artisan::call('migrate:install');
    Artisan::call('migrate', ['--quiet' => true, '--force' => true]);
    echo '<br>done with Migrate tables';
});

Route::get('composer', function () {
    shell_exec('composer install');
});

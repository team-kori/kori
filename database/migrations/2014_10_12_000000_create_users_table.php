<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateUsersTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create( 'users', function ( Blueprint $table ) {
            $table->engine = 'InnoDB';

            $table->increments( 'id' );
            $table->integer( 'category_id' )->unsigned()->nullable();
            $table->string( 'username' )->unique();
            $table->string( 'firstName' );
            $table->string( 'lastName' );
            $table->string( 'email' )->unique();
            $table->binary( 'profilePic' );
            $table->string( 'facebook' );
            $table->string( 'twitter' );
            $table->string( 'gplus' );
            $table->string( 'linkedIn' );
            $table->string( 'behance' );
            $table->string( 'devianArt' );
            $table->string( 'youtube' );
            $table->string( 'site' );
            $table->date( 'birthDate' );
            $table->string( 'country' );
            $table->string( 'city' );
            $table->string( 'phoneNumber' );
            $table->boolean( 'isArtist' );
            $table->string( 'password', 60 );
            $table->rememberToken();
            $table->timestamps();
        } );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop( 'users' );
    }

}

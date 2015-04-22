<?php namespace LittleNinja\Database\Migrations;

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUsersTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->engine = 'InnoDB';

            $table->increments('id');
            $table->integer('category_id')->unsigned()->nullable();
            $table->string('username')->unique();
            $table->string('firstName');
            $table->string('lastName');
            $table->string('gender', 20);
            $table->string('email')->unique();
            $table->string('profilePic');
            $table->string('facebook');
            $table->string('twitter');
            $table->string('gplus');
            $table->string('linkedIn');
            $table->string('behance');
            $table->string('devianArt');
            $table->string('youtube');
            $table->string('site');
            $table->date('birthDate');
            $table->string('country');
            $table->string('city');
            $table->string('phoneNumber');
            $table->string('role', 20);
            $table->string('password', 60);
            $table->rememberToken();
            $table->boolean('confirmed')->default(0);
            $table->string('confirmation_code', 40)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('users');
    }
}

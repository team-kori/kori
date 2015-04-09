<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateCreationsTable extends Migration {

	/**
	 * Run the migrations.
	 *
	 * @return void
	 */
	public function up()
	{
		Schema::create('creations', function(Blueprint $table)
		{
			$table->increments('id');
            $table->integer( 'user_id' )->unsigned();
            $table->integer( 'gallery_id' )->unsigned();
            $table->string( 'fileUrl' );
            $table->text( 'description' );
            $table->integer( 'likes' );
			$table->timestamps();

            $table->foreign( 'user_id' )
                ->references( 'id' )
                ->on( 'users' )
                ->onDelete( 'cascade' );

            $table->foreign( 'gallery_id' )
                ->references( 'id' )
                ->on( 'galleries' )
                ->onDelete( 'cascade' );
		});
	}

	/**
	 * Reverse the migrations.
	 *
	 * @return void
	 */
	public function down()
	{
		Schema::drop('creations');
	}

}

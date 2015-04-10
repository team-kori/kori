<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;

class CreateCommentsTable extends Migration
{

    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create( 'comments', function ( Blueprint $table ) {
            $table->increments( 'id' );
            $table->integer( 'blogPost_id' )->unsigned()->nullable();
            $table->integer( 'user_id' )->unsigned();
            $table->integer( 'creation_id' )->unsigned()->nullable();
            $table->integer( 'event_id' )->unsigned()->nullable();
            $table->integer( 'gallery_id' )->unsigned()->nullable();
            $table->text( 'content' );
            $table->timestamps();

            $table->foreign( 'blogPost_id' )
                ->references( 'id' )
                ->on( 'blog_posts' )
                ->onDelete( 'cascade' );

            $table->foreign( 'user_id' )
                ->references( 'id' )
                ->on( 'users' )
                ->onDelete( 'cascade' );

            $table->foreign( 'creation_id' )
                ->references( 'id' )
                ->on( 'creations' )
                ->onDelete( 'cascade' );

            $table->foreign( 'event_id' )
                ->references( 'id' )
                ->on( 'events' )
                ->onDelete( 'cascade' );

            $table->foreign( 'gallery_id' )
                ->references( 'id' )
                ->on( 'galleries' )
                ->onDelete( 'cascade' );
        } );
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop( 'comments' );
    }

}

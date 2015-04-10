<?php namespace Kori;

use Illuminate\Database\Eloquent\Model;

class BlogPost extends Model
{

    protected $table = 'blog_posts';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'content',
        'likes'
    ];

    public function comments()
    {
        return $this->hasMany( 'Kori\Comment' );
    }

    public function user()
    {
        return $this->belongsTo( 'Kori\User' );
    }

}

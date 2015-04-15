<?php namespace Kori;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{

    protected $table = 'comments';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'content'
    ];

    public function blogPost()
    {
        return $this->belongsTo( 'Kori\BlogPost' );
    }

    public function creation()
    {
        return $this->belongsTo( 'Kori\Creation' );
    }

    public function user()
    {
        return $this->belongsTo( 'Kori\User' );
    }

    public function gallery()
    {
        return $this->belongsTo( 'Kori\Gallery' );
    }

    public function event()
    {
        return $this->belongsTo( 'Kori\Event' );
    }

}

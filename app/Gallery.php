<?php namespace Kori;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model {

    protected $table = 'galleries';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'description',
        'likes'
    ];

    public function comments()
    {
        return $this->hasMany( 'Kori\Comment' );
    }

    public function creations()
    {
        return $this->hasMany( 'Kori\Creation' );
    }

    public function user()
    {
        return $this->belongsTo( 'Kori\User' );
    }

}

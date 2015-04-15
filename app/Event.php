<?php namespace Kori;

use Illuminate\Database\Eloquent\Model;

class Event extends Model
{

    protected $table = 'events';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name',
        'description',
        'location',
        'time'
    ];

    public function user()
    {
        return $this->belongsTo( 'Kori\User' );
    }

    public function comments()
    {
        return $this->hasMany( 'Kori\Comment' );
    }

}

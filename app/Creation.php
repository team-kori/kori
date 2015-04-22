<?php namespace Kori;

use Illuminate\Database\Eloquent\Model;

class Creation extends Model
{

    protected $table = 'creations';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'fileUrl',
        'description',
        'likes'
    ];

    public function comments()
    {
        return $this->hasMany('Kori\Comment');
    }

    public function user()
    {
        return $this->belongsTo('Kori\User');
    }

    public function gallery()
    {
        return $this->belongsTo('Kori\Gallery');
    }

}

<?php namespace Kori;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{

    protected $table = 'categories';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name'
    ];

    public function category()
    {
        return $this->hasOne('Kori\Category');
    }

    public function users()
    {
        return $this->belongsToMany('Kori\User');
    }

}

<?php namespace Kori;

use Carbon\Carbon;
use Illuminate\Auth\Authenticatable;
use Illuminate\Auth\Passwords\CanResetPassword;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\CanResetPassword as CanResetPasswordContract;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int id
 * @property string username
 * @property string profilePic
 */
class User extends Model implements AuthenticatableContract, CanResetPasswordContract
{

    use Authenticatable, CanResetPassword;

    /**
     * The database table used by the model.
     *
     * @var string
     */
    protected $table = 'users';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'username',
        'firstName',
        'lastName',
        'email',
        'password',
        'confirmation_code',
        'profilePic',
        'facebook',
        'twitter',
        'linkedIn',
        'behance',
        'devianArt',
        'youtube',
        'gplus',
        'site',
        'birthDate',
        'country',
        'city',
        'phoneNumber',
        'role',
        'gender',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'password',
        'remember_token'
    ];

    /**
     * Set the birthDate attribute
     *
     * @param $date
     */
    public function setBirthDateAttribute($date)
    {
        if ($date) {
            $this->attributes['birthDate'] = Carbon::createFromFormat('Y-m-d', $date);
        } else {
            $this->attributes['birthDate'] = null;
        }
    }

    /**
     * Get the birthDate attribute
     *
     * @param $date
     *
     * @return Carbon
     */
    public function getBirthDateAttribute($date)
    {
        return new Carbon($date);
    }

    public function blogPosts()
    {
        return $this->hasMany('Kori\BlogPost');
    }

    public function comments()
    {
        return $this->hasMany('Kori\Comment');
    }

    public function creations()
    {
        return $this->hasMany('Kori\Creation');
    }

    public function galleries()
    {
        return $this->hasMany('Kori\Gallery');
    }

    public function events()
    {
        return $this->hasMany('Kori\Event');
    }

    public function category()
    {
        return $this->belongsToMany('Kori\Category');
    }
}

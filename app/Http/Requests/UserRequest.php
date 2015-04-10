<?php namespace Kori\Http\Requests;

class UserRequest extends Request
{

    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'username' => 'max:255',
            'firstName' => 'max:255|alpha_dash',
            'lastName' => 'max:255|alpha_dash',
            'email' => 'max:255|email',
            'profilePic' => 'image',
            'facebook' => 'max:255|active_url',
            'twitter' => 'max:255|active_url',
            'behance' => 'max:255|active_url',
            'devianArt' => 'max:255|active_url',
            'youtube' => 'max:255|active_url',
            'site' => 'max:255|active_url',
            'linkedIn' => 'max:255|active_url',
            'gplus' => 'max:255|active_url',
            'birthDate' => 'date|date_format:"Y-m-d"',
            'country' => 'max:255|alpha_dash',
            'city' => 'max:255|alpha_dash',
            'phoneNumber' => 'numeric'
        ];
    }

}

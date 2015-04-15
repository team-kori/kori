@extends('app')

@section('content')
    <h2>
        {{ $user->username }}
        <a href="{{ urldecode( url( '/users', $user->username . '/edit' ) ) }}"
           class="btn btn-default glyphicon glyphicon-edit"></a>
    </h2>
    <img src="{{ asset( 'profilePics/' . $user->profilePic ) }}"
         alt="{{ $user->username }}'s profile picture"
         title="{{ $user->username }}'s profile picture"/>

    <div class="row">
        <dl class="col-sm-6">
            @if($user->firstName || $user->lastName)
                <dt>Name</dt>
                <dd>{{ $user->firstName . ' ' .  $user->lastName }}</dd>
            @endif
            @if($user->email)
                <dt>Email</dt>
                <dd>
                    <a href="mailto:{{ $user->email }}" title="Send mail to {{ $user->username }}">
                        {{ $user->email }}
                    </a>
                </dd>
            @endif
            @if($user->country)
                <dt>Location</dt>
                <dd>
                    {{ $user->city . ', ' . Countries::getOne($user->country, App::getLocale(), 'icu') }}
                </dd>
            @endif
            @if($user->birthDate)
                <dt>Date of birth</dt>
                <dd><time datetime="{{ $user->birthDate }}">{{ $user->birthDate->toFormattedDateString() }}</time></dd>
            @endif
            @if($user->phoneNumber)
                <dt>Phone number</dt>
                <dd>{{ $user->phoneNumber }}</dd>
            @endif
        </dl>
        <ul class="col-sm-6">
            @if($user->facebook)
                <li>
                    <a href="{{ $user->facebook }}">Facebook</a>
                </li>
            @endif
            @if($user->twitter)
                <li>
                    <a href="{{ $user->twitter }}">twitter</a>
                </li>
            @endif
            @if($user->gplus)
                <li>
                    <a href="{{ $user->gplus }}">gplus</a>
                </li>
            @endif
            @if($user->linkedIn)
                <li>
                    <a href="{{ $user->linkedIn }}">linkedIn</a>
                </li>
            @endif
            @if($user->behance)
                <li>
                    <a href="{{ $user->behance }}">behance</a>
                </li>
            @endif
            @if($user->devianArt)
                <li>
                    <a href="{{ $user->devianArt }}">devianArt</a>
                </li>
            @endif
            @if($user->youtube)
                <li>
                    <a href="{{ $user->youtube }}">youtube</a>
                </li>
            @endif
            @if($user->site)
                <li>
                    <a href="{{ $user->site }}">Site</a>
                </li>
            @endif
        </ul>
    </div>
@endsection

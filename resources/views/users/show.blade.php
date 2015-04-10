@extends('app')

@section('content')
    <h2>{{ $user->username }}</h2>
    <img src="{{ asset( 'profilePics/' . $user->profilePic ) }}" alt="{{ $user->username }}"/>
@endsection

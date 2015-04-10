@extends('app')
<?php
Form::macro( 'tel', function ( $value ) {
    return '<input type="tel" name="my_custom_datetime_field" value="' . $value . '"/>';
} ); ?>

@section('content')
    @include('errors.list')

    {!! Form::model($user, ['method' => 'PATCH', 'files' => true, 'url' => 'users/' . $user->username]) !!}

    <div class="row">
        {{-- Username form input --}}
        <div class="form-group col-sm-6">
            {!! Form::label('username', 'Username:') !!}
            {!! Form::text('username', null, ['class' => 'form-control']) !!}
        </div>

        {{-- ProfilePic form input --}}
        <div class="form-group col-sm-6">
            {!! Form::label('profilePic', 'Profile picture:') !!}
            {!! Form::file('profilePic', ['class' => 'form-control']) !!}
        </div>
    </div>

    <div class="row">
        {{-- FirstName form input --}}
        <div class="form-group col-sm-6">
            {!! Form::label('firstName', 'First name:') !!}
            {!! Form::text('firstName', null, ['class' => 'form-control']) !!}
        </div>

        {{-- LastName form input --}}
        <div class="form-group col-sm-6">
            {!! Form::label('lastName', 'Last name:') !!}
            {!! Form::text('lastName', null, ['class' => 'form-control']) !!}
        </div>
    </div>

    <div class="row">
        {{-- Email form input --}}
        <div class="form-group col-sm-6">
            {!! Form::label('email', 'Email:') !!}
            {!! Form::email('email', null, ['class' => 'form-control']) !!}
        </div>

        {{-- PhoneNumber form input --}}
        <div class="form-group col-sm-6">
            {!! Form::label('phoneNumber', 'Phone number:') !!}
            {!! Form::input('tel', 'phoneNumber', null, ['class' => 'form-control']) !!}
        </div>
    </div>

    <div class="row">
        {{-- Facebook form input --}}
        <div class="form-group col-sm-4">
            {!! Form::label('facebook', 'Facebook:', ['class' => '']) !!}
            {!! Form::text('facebook', null, ['class' => 'form-control']) !!}
        </div>

        {{-- Twitter form input --}}
        <div class="form-group col-sm-4">
            {!! Form::label('twitter', 'Twitter:') !!}
            {!! Form::text('twitter', null, ['class' => 'form-control']) !!}
        </div>

        {{-- Google+ form input --}}
        <div class="form-group col-sm-4">
            {!! Form::label('gplus', 'Google+:') !!}
            {!! Form::text('gplus', null, ['class' => 'form-control']) !!}
        </div>
    </div>

    <div class="row">
        {{-- Behance form input --}}
        <div class="form-group col-sm-4">
            {!! Form::label('behance', 'Behance:') !!}
            {!! Form::text('behance', null, ['class' => 'form-control']) !!}
        </div>

        {{-- Devian art form input --}}
        <div class="form-group col-sm-4">
            {!! Form::label('devianArt', 'Devian art:') !!}
            {!! Form::text('devianArt', null, ['class' => 'form-control']) !!}
        </div>

        {{-- Youtube form input --}}
        <div class="form-group col-sm-4">
            {!! Form::label('youtube', 'Youtube:') !!}
            {!! Form::text('youtube', null, ['class' => 'form-control']) !!}
        </div>
    </div>

    <div class="row">
        {{-- Site form input --}}
        <div class="form-group col-sm-4">
            {!! Form::label('site', 'Site:') !!}
            {!! Form::input('url', 'site', null, ['class' => 'form-control']) !!}
        </div>

        {{-- LinkedIn form input --}}
        <div class="form-group col-sm-4">
            {!! Form::label('linkedIn', 'LinkedIn:') !!}
            {!! Form::text('linkedIn', null, ['class' => 'form-control']) !!}
        </div>


        <div class="form-group col-sm-4">
            {!! Form::label('birthDate', 'Birth date:') !!}
            {!! Form::input('date', 'birthDate', $user->birthDate->format('Y-m-d'), ['class' =>
            'form-control']) !!}
        </div>
    </div>

    <div class="row">
        {{-- Country form input --}}
        <div class="form-group col-sm-6">
            {!! Form::label('country', 'Country:') !!}
            {!! Form::select('country', ['key' => 'value'], null, ['class' => 'form-control']) !!}
        </div>

        {{-- City form input --}}
        <div class="form-group col-sm-6">
            {!! Form::label('city', 'City:') !!}
            {!! Form::text('city', null, ['class' => 'form-control']) !!}
        </div>
    </div>

    <div class="form-group">
        {!! Form::submit('Submit', ['class' => 'btn btn-primary form-control']) !!}
    </div>

    {!! Form::close() !!}
@endsection

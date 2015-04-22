@extends('app')

@section('content')
    <div class="panel panel-default">
        <div class="panel-heading">Users</div>
        <div class="panel-body">
            <p>...</p>
        </div>

        <table class="table table-hover">
            <thead>
            <tr>
                <th>ID</th>
                <th>Full name</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Manage</th>
            </tr>
            </thead>
            <tbody>
            @foreach($users as $user)
                <tr>
                    <td>{{ $user->id }}</td>
                    <td>{{ $user->firstName . ' ' . $user->lastName }}</td>
                    <td>{{ $user->username }}</td>
                    <td>{{ $user->email }}</td>
                    <td class="visible-">{{ $user->role }}</td>
                    <td>
                        {!! link_to_action( 'UsersController@edit', '', ['user' => $user->username],
                                ['class' => 'btn btn-default glyphicon glyphicon-edit'] ) !!}
                        {!! Form::open(['method' => 'DELETE', 'class' => 'inline',
                                'action' => ['UsersController@destroy', $user->username]]) !!}
                            <button type="submit" class="btn btn-danger glyphicon glyphicon-remove-circle"></button>
                        {!! Form::close() !!}
                    </td>
                </tr>
            @endforeach
            </tbody>
        </table>
    </div>
@endsection

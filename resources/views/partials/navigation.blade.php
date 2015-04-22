<nav class="navbar navbar-fixed-top navbar-inverse">
    <div class="container">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse"
                    data-target="#bs-example-navbar-collapse-1">
                <span class="sr-only">Toggle Navigation</span>
                <span class="icon-bar"></span>
                <span class="icon-bar"></span>
            </button>
            <a class="navbar-brand" href="#">Laravel</a>
        </div>

        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul class="nav navbar-nav">
                <li>{!! link_to_route( 'home', 'Home' ) !!}</li>
            </ul>

            <div class="nav navbar-text navbar-right">
                @if (Auth::guest())
                    {!! link_to_action( 'Auth\AuthController@getRegister', 'Register' ) !!}
                    {!! link_to_action( 'Auth\AuthController@getLogin', 'Login' ) !!}
                @else
                    {!! link_to_action( 'UsersController@show', $user->username, ['user' => $user->username] ) !!}
                    {!! link_to_action( 'Auth\AuthController@getLogout', '', null,
                            ['class' => 'glyphicon glyphicon-share'] ) !!}
                @endif
            </div>
        </div>
    </div>
</nav>

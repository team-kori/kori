<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Kori</title>

    <link href="{{ asset( '/css/all.css' ) }}" rel="stylesheet">
    <link rel="icon" type="image/png" href="{{ asset( 'favicon.png' ) }}"/>

    <!-- Fonts -->
    <link href='//fonts.googleapis.com/css?family=Roboto:400,300' rel='stylesheet' type='text/css'>

</head>
<body>

<div class="container">
    @include('partials.navigation')

    @yield('content')

    <footer class="footer navbar-inverse navbar-fixed-bottom text-center text-info v">
        <div class="container">
            <a href="https://github.com/team-kori/kori" target="_blank">KORI SYSTEM</a> - {{ shell_exec( 'git describe --tags' ) }}
            © 2015 - Kori. All Rights Reserved.
        </div>
    </footer>
</div>


<script src="{{ asset( '/js/all.js' ) }}"></script>
</body>
</html>

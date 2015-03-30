'use strict';

var koriApp = angular.module('koriApp', [
    'ngRoute',
    'ui.bootstrap',
    'ngResource'
])

    .config([
        '$routeProvider',
        '$locationProvider',
        function ($routeProvider, $locationProvider) {
            $locationProvider.hashPrefix('!');
            $locationProvider.html5Mode(true);

            $routeProvider.when('/', {
                title: 'Начало',
                templateUrl: 'templates/home.html',
                controller: 'HomeController'
            });

            $routeProvider.when('/events', {
                title: 'Събития',
                templateUrl: 'templates/events.html',
                controller: 'EventsController'
            });

            $routeProvider.when('/categories', {
                title: 'Категории',
                templateUrl: 'templates/categories.html',
                controller: 'CategoriesController'
            });

            $routeProvider.when('/about-us', {
                title: 'За нас',
                templateUrl: 'templates/about-us.html',
                controller: 'UserHomeCtrl'
            });

            $routeProvider.when('/user/profile', {
                title: 'Профил',
                templateUrl: 'templates/edit-profile.html',
                controller: 'EditProfileController'
            });

            $routeProvider.otherwise({redirectTo: '/'});
        }]);

koriApp.constant('baseServiceUrl', 'https://api.parse.com/1/');

koriApp.run(function ($rootScope, $location) {

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
     $rootScope.title = current.$$route.title;
     });

    $rootScope.$on('$locationChangeStart', function () {
        if ($location.path().indexOf('/user/') != -1 && !authentication.isLoggedIn()) {
            // Authorization check: anonymous site visitors cannot access user routes
            $location.path('/');
        }
    });
});

'use strict';

var koriApp = angular.module('koriApp', [
    'ngRoute',
    'ngResource',
    'LocalStorageModule'
])

    .config([
        '$routeProvider',
        'localStorageServiceProvider',
        function ($routeProvider, localStorageServiceProvider) {
            $routeProvider.when('/', {
                title: 'Home',
                templateUrl: 'templates/home.html',
                controller: 'HomeController'
            });

            /*$routeProvider.when('/login', {
             title: 'Login',
             templateUrl: 'templates/login.html',
             controller: 'LoginCtrl'
             });

             $routeProvider.when('/register', {
             title: 'Register',
             templateUrl: 'templates/register.html',
             controller: 'RegisterCtrl'
             });

             $routeProvider.when('/user/home', {
             title: 'Home',
             templateUrl: 'templates/user-home.html',
             controller: 'UserHomeCtrl'
             });

             $routeProvider.when('/user/ads', {
             title: 'My ads',
             templateUrl: 'templates/user-home.html',
             controller: 'UserAdsCtrl'
             });

             $routeProvider.when('/user/ads/publish', {
             title: 'Publish new ad',
             templateUrl: 'templates/publish-new-ad.html',
             controller: 'PublishNewAdCtrl'
             });

             $routeProvider.when('/user/ads/edit/:id', {
             title: 'Edit ad',
             templateUrl: 'templates/edit-ad.html',
             controller: 'EditAdCtrl'
             });

             $routeProvider.when('/user/ads/delete/:id', {
             title: 'Delete ad',
             templateUrl: 'templates/delete-ad.html',
             controller: 'DeleteAdCtrl'
             });

             $routeProvider.when('/user/profile', {
             title: 'Edit user profile',
             templateUrl: 'templates/edit-profile.html',
             controller: 'EditProfileCtrl'
             });*/

            $routeProvider.otherwise({redirectTo: '/'});

            // Web storage settings
            localStorageServiceProvider.setStorageType('localStorage');
        }]);

koriApp.constant('baseServiceUrl', 'https://api.parse.com/1/');
koriApp.constant('pageSize', 5);

koriApp.run(["$rootScope", "$location", "authentication", function ($rootScope, $location, authentication) {

    /*$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
     $rootScope.title = current.$$route.title;
     });*/

    $rootScope.$on('$locationChangeStart', function () {
        if ($location.path().indexOf('/user/') != -1 && !authentication.isLoggedIn()) {
            // Authorization check: anonymous site visitors cannot access user routes
            $location.path('/');
        }
    });
}]);

koriApp.directive('navigation', function () {
    return {
        restrict: "E",
        templateUrl: "templates/directives/navigation.html",
        replace: true
    }
});
/* HomeController */

koriApp.controller('HomeController', [
    '$scope',
    function ($scope, ngDialog) {
        /*$scope.openLogin = function () {
         ngDialog.open({
         template: 'templates/login.html',
         controller: 'LoginController'
         });
         }*/
    }
]);
/* LoginController */

koriApp.controller('LoginController',
    function () {

    }
);
'use strict';

koriApp.factory('authentication', [
    'localStorageService',
    function (localStorageService) {

        var key = 'user';

        function saveUserData(data) {
            localStorageService.set(key, data);
        }

        function getUserData() {
            return localStorageService.get(key);
        }

        function removeUser() {
            localStorage.removeItem('ls.user');
        }

        function getHeaders() {
            var headers = {};
            var userData = getUserData();

            if (userData) {
                headers.Authorization = 'Bearer ' + userData.access_token;
            }

            return headers;
        }

        function isAdmin() {
            return getUserData().isAdmin;
        }

        function isLoggedIn() {
            return !!getUserData();
        }

        return {
            saveUser: saveUserData,
            getUserData: getUserData,
            removeUser: removeUser,
            getHeaders: getHeaders,
            isAdmin: isAdmin,
            isLoggedIn: isLoggedIn
        }
    }]);

'use strict';

koriApp.factory(
    'notification',
    function () {
        return {
            showInfo: function (msg) {
                noty({
                        text: msg,
                        type: 'info',
                        layout: 'topCenter',
                        timeout: 3000
                    }
                );
            },
            showError: function (msg, serverError) {
                // Collect errors to display from the server response
                var errors = [];
                if (serverError && serverError.data.error_description) {
                    errors.push(serverError.data.error_description);
                }

                if (serverError && serverError.data.modelState) {
                    var modelStateErrors = serverError.data.modelState;
                    for (var propertyName in modelStateErrors) {
                        var errorMessages = modelStateErrors[propertyName];
                        var trimmedName =
                            propertyName.substr(propertyName.indexOf('.') + 1);
                        for (var i = 0; i < errorMessages.length; i++) {
                            var currentError = errorMessages[i];
                            errors.push(trimmedName + ' - ' + currentError);
                        }
                    }
                }

                if (errors.length > 0) {
                    msg = msg + ":<br>" + errors.join("<br>");
                }

                noty({
                        text: msg,
                        type: 'error',
                        layout: 'topCenter',
                        timeout: 5000
                    }
                );
            }
        }
    }
);

'use strict';

koriApp.factory('userData', [
    '$http',
    '$resource',
    'baseServiceUrl',
    'authentication',
    function ($http, $resource, baseServiceUrl, authentication) {

        var userServiceUrl = baseServiceUrl + 'users/';

        function getUserProfile() {
            var resource = $resource(userServiceUrl + 'profile', {}, {
                get: {
                    method: 'GET',
                    headers: authentication.getHeaders()
                }
            });

            return resource.get();
        }

        function registerUser(user) {
            return $resource(userServiceUrl)
                .save(user);
        }

        function loginUser(user) {
            var resource = $resource(baseServiceUrl + 'login')
                .save(user);

            resource.$promise
                .then(
                function success(data) {
                    authentication.saveUser(data);
                }
            );

            return resource;
        }

        function editUserProfile(user) {
            var resource = $resource(userServiceUrl + 'profile', {}, {
                update: {
                    method: 'PUT',
                    headers: authentication.getHeaders()
                }
            });

            return resource.update(user);
        }

        function changeUserPassword(pass) {
            var resource = $resource(baseServiceUrl + 'requestPasswordReset', {}, {
                update: {
                    method: 'POST',
                    headers: authentication.getHeaders()
                }
            });

            return resource.update(pass);
        }

        function logout() {
            authentication.removeUser();
        }

        return {
            getUserProfile: getUserProfile,
            register: registerUser,
            login: loginUser,
            edit: editUserProfile,
            changePassword: changeUserPassword,
            logout: logout
        }
    }]);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImRpcmVjdGl2ZXMvbmF2aWdhdGlvbi5qcyIsImNvbnRyb2xsZXJzL0hvbWVDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvTG9naW5Db250cm9sbGVyLmpzIiwic2VydmljZXMvYXV0aGVudGljYXRpb24uanMiLCJzZXJ2aWNlcy9ub3RpZmljYXRpb24uanMiLCJzZXJ2aWNlcy9kYXRhL3VzZXJEYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBLElBQUEsVUFBQSxRQUFBLE9BQUEsV0FBQTtJQUNBO0lBQ0E7SUFDQTs7O0tBR0EsT0FBQTtRQUNBO1FBQ0E7UUFDQSxVQUFBLGdCQUFBLDZCQUFBO1lBQ0EsZUFBQSxLQUFBLEtBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxhQUFBO2dCQUNBLFlBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQW1EQSxlQUFBLFVBQUEsQ0FBQSxZQUFBOzs7WUFHQSw0QkFBQSxlQUFBOzs7QUFHQSxRQUFBLFNBQUEsa0JBQUE7QUFDQSxRQUFBLFNBQUEsWUFBQTs7QUFFQSxRQUFBLGtEQUFBLFVBQUEsWUFBQSxXQUFBLGdCQUFBOzs7Ozs7SUFNQSxXQUFBLElBQUEsd0JBQUEsWUFBQTtRQUNBLElBQUEsVUFBQSxPQUFBLFFBQUEsYUFBQSxDQUFBLEtBQUEsQ0FBQSxlQUFBLGNBQUE7O1lBRUEsVUFBQSxLQUFBOzs7OztBQ3BGQSxRQUFBLFVBQUEsY0FBQSxZQUFBO0lBQ0EsT0FBQTtRQUNBLFVBQUE7UUFDQSxhQUFBO1FBQ0EsU0FBQTs7Ozs7QUNGQSxRQUFBLFdBQUEsa0JBQUE7SUFDQTtJQUNBLFVBQUEsUUFBQSxVQUFBOzs7Ozs7Ozs7OztBQ0ZBLFFBQUEsV0FBQTtJQUNBLFlBQUE7Ozs7QUNIQTs7QUFFQSxRQUFBLFFBQUEsa0JBQUE7SUFDQTtJQUNBLFVBQUEscUJBQUE7O1FBRUEsSUFBQSxNQUFBOztRQUVBLFNBQUEsYUFBQSxNQUFBO1lBQ0Esb0JBQUEsSUFBQSxLQUFBOzs7UUFHQSxTQUFBLGNBQUE7WUFDQSxPQUFBLG9CQUFBLElBQUE7OztRQUdBLFNBQUEsYUFBQTtZQUNBLGFBQUEsV0FBQTs7O1FBR0EsU0FBQSxhQUFBO1lBQ0EsSUFBQSxVQUFBO1lBQ0EsSUFBQSxXQUFBOztZQUVBLElBQUEsVUFBQTtnQkFDQSxRQUFBLGdCQUFBLFlBQUEsU0FBQTs7O1lBR0EsT0FBQTs7O1FBR0EsU0FBQSxVQUFBO1lBQ0EsT0FBQSxjQUFBOzs7UUFHQSxTQUFBLGFBQUE7WUFDQSxPQUFBLENBQUEsQ0FBQTs7O1FBR0EsT0FBQTtZQUNBLFVBQUE7WUFDQSxhQUFBO1lBQ0EsWUFBQTtZQUNBLFlBQUE7WUFDQSxTQUFBO1lBQ0EsWUFBQTs7OztBQzdDQTs7QUFFQSxRQUFBO0lBQ0E7SUFDQSxZQUFBO1FBQ0EsT0FBQTtZQUNBLFVBQUEsVUFBQSxLQUFBO2dCQUNBLEtBQUE7d0JBQ0EsTUFBQTt3QkFDQSxNQUFBO3dCQUNBLFFBQUE7d0JBQ0EsU0FBQTs7OztZQUlBLFdBQUEsVUFBQSxLQUFBLGFBQUE7O2dCQUVBLElBQUEsU0FBQTtnQkFDQSxJQUFBLGVBQUEsWUFBQSxLQUFBLG1CQUFBO29CQUNBLE9BQUEsS0FBQSxZQUFBLEtBQUE7OztnQkFHQSxJQUFBLGVBQUEsWUFBQSxLQUFBLFlBQUE7b0JBQ0EsSUFBQSxtQkFBQSxZQUFBLEtBQUE7b0JBQ0EsS0FBQSxJQUFBLGdCQUFBLGtCQUFBO3dCQUNBLElBQUEsZ0JBQUEsaUJBQUE7d0JBQ0EsSUFBQTs0QkFDQSxhQUFBLE9BQUEsYUFBQSxRQUFBLE9BQUE7d0JBQ0EsS0FBQSxJQUFBLElBQUEsR0FBQSxJQUFBLGNBQUEsUUFBQSxLQUFBOzRCQUNBLElBQUEsZUFBQSxjQUFBOzRCQUNBLE9BQUEsS0FBQSxjQUFBLFFBQUE7Ozs7O2dCQUtBLElBQUEsT0FBQSxTQUFBLEdBQUE7b0JBQ0EsTUFBQSxNQUFBLFVBQUEsT0FBQSxLQUFBOzs7Z0JBR0EsS0FBQTt3QkFDQSxNQUFBO3dCQUNBLE1BQUE7d0JBQ0EsUUFBQTt3QkFDQSxTQUFBOzs7Ozs7OztBQzNDQTs7QUFFQSxRQUFBLFFBQUEsWUFBQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0EsVUFBQSxPQUFBLFdBQUEsZ0JBQUEsZ0JBQUE7O1FBRUEsSUFBQSxpQkFBQSxpQkFBQTs7UUFFQSxTQUFBLGlCQUFBO1lBQ0EsSUFBQSxXQUFBLFVBQUEsaUJBQUEsV0FBQSxJQUFBO2dCQUNBLEtBQUE7b0JBQ0EsUUFBQTtvQkFDQSxTQUFBLGVBQUE7Ozs7WUFJQSxPQUFBLFNBQUE7OztRQUdBLFNBQUEsYUFBQSxNQUFBO1lBQ0EsT0FBQSxVQUFBO2lCQUNBLEtBQUE7OztRQUdBLFNBQUEsVUFBQSxNQUFBO1lBQ0EsSUFBQSxXQUFBLFVBQUEsaUJBQUE7aUJBQ0EsS0FBQTs7WUFFQSxTQUFBO2lCQUNBO2dCQUNBLFNBQUEsUUFBQSxNQUFBO29CQUNBLGVBQUEsU0FBQTs7OztZQUlBLE9BQUE7OztRQUdBLFNBQUEsZ0JBQUEsTUFBQTtZQUNBLElBQUEsV0FBQSxVQUFBLGlCQUFBLFdBQUEsSUFBQTtnQkFDQSxRQUFBO29CQUNBLFFBQUE7b0JBQ0EsU0FBQSxlQUFBOzs7O1lBSUEsT0FBQSxTQUFBLE9BQUE7OztRQUdBLFNBQUEsbUJBQUEsTUFBQTtZQUNBLElBQUEsV0FBQSxVQUFBLGlCQUFBLHdCQUFBLElBQUE7Z0JBQ0EsUUFBQTtvQkFDQSxRQUFBO29CQUNBLFNBQUEsZUFBQTs7OztZQUlBLE9BQUEsU0FBQSxPQUFBOzs7UUFHQSxTQUFBLFNBQUE7WUFDQSxlQUFBOzs7UUFHQSxPQUFBO1lBQ0EsZ0JBQUE7WUFDQSxVQUFBO1lBQ0EsT0FBQTtZQUNBLE1BQUE7WUFDQSxnQkFBQTtZQUNBLFFBQUE7OztBQUdBIiwiZmlsZSI6ImFwcC9hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XHJcblxyXG52YXIga29yaUFwcCA9IGFuZ3VsYXIubW9kdWxlKCdrb3JpQXBwJywgW1xyXG4gICAgJ25nUm91dGUnLFxyXG4gICAgJ25nUmVzb3VyY2UnLFxyXG4gICAgJ0xvY2FsU3RvcmFnZU1vZHVsZSdcclxuXSlcclxuXHJcbiAgICAuY29uZmlnKFtcclxuICAgICAgICAnJHJvdXRlUHJvdmlkZXInLFxyXG4gICAgICAgICdsb2NhbFN0b3JhZ2VTZXJ2aWNlUHJvdmlkZXInLFxyXG4gICAgICAgIGZ1bmN0aW9uICgkcm91dGVQcm92aWRlciwgbG9jYWxTdG9yYWdlU2VydmljZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0hvbWUnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvaG9tZS5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcidcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvKiRyb3V0ZVByb3ZpZGVyLndoZW4oJy9sb2dpbicsIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnTG9naW4nLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbG9naW4uaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9yZWdpc3RlcicsIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVnaXN0ZXInLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcmVnaXN0ZXIuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVnaXN0ZXJDdHJsJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJy91c2VyL2hvbWUnLCB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0hvbWUnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvdXNlci1ob21lLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzZXJIb21lQ3RybCdcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvdXNlci9hZHMnLCB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ015IGFkcycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy91c2VyLWhvbWUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVXNlckFkc0N0cmwnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIud2hlbignL3VzZXIvYWRzL3B1Ymxpc2gnLCB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1B1Ymxpc2ggbmV3IGFkJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3B1Ymxpc2gtbmV3LWFkLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1B1Ymxpc2hOZXdBZEN0cmwnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIud2hlbignL3VzZXIvYWRzL2VkaXQvOmlkJywge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdFZGl0IGFkJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2VkaXQtYWQuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRWRpdEFkQ3RybCdcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvdXNlci9hZHMvZGVsZXRlLzppZCcsIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnRGVsZXRlIGFkJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RlbGV0ZS1hZC5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdEZWxldGVBZEN0cmwnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIud2hlbignL3VzZXIvcHJvZmlsZScsIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnRWRpdCB1c2VyIHByb2ZpbGUnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZWRpdC1wcm9maWxlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRQcm9maWxlQ3RybCdcclxuICAgICAgICAgICAgfSk7Ki9cclxuXHJcbiAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyLm90aGVyd2lzZSh7cmVkaXJlY3RUbzogJy8nfSk7XHJcblxyXG4gICAgICAgICAgICAvLyBXZWIgc3RvcmFnZSBzZXR0aW5nc1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlUHJvdmlkZXIuc2V0U3RvcmFnZVR5cGUoJ2xvY2FsU3RvcmFnZScpO1xyXG4gICAgICAgIH1dKTtcclxuXHJcbmtvcmlBcHAuY29uc3RhbnQoJ2Jhc2VTZXJ2aWNlVXJsJywgJ2h0dHBzOi8vYXBpLnBhcnNlLmNvbS8xLycpO1xyXG5rb3JpQXBwLmNvbnN0YW50KCdwYWdlU2l6ZScsIDUpO1xyXG5cclxua29yaUFwcC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsICRsb2NhdGlvbiwgYXV0aGVudGljYXRpb24pIHtcclxuXHJcbiAgICAvKiRyb290U2NvcGUuJG9uKCckcm91dGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24gKGV2ZW50LCBjdXJyZW50LCBwcmV2aW91cykge1xyXG4gICAgICAgICRyb290U2NvcGUudGl0bGUgPSBjdXJyZW50LiQkcm91dGUudGl0bGU7XHJcbiAgICB9KTsqL1xyXG5cclxuICAgICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdGFydCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoJGxvY2F0aW9uLnBhdGgoKS5pbmRleE9mKCcvdXNlci8nKSAhPSAtMSAmJiAhYXV0aGVudGljYXRpb24uaXNMb2dnZWRJbigpKSB7XHJcbiAgICAgICAgICAgIC8vIEF1dGhvcml6YXRpb24gY2hlY2s6IGFub255bW91cyBzaXRlIHZpc2l0b3JzIGNhbm5vdCBhY2Nlc3MgdXNlciByb3V0ZXNcclxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8nKTtcclxuICAgICAgICB9XHJcbiAgICB9KTtcclxufSk7XHJcbiIsImtvcmlBcHAuZGlyZWN0aXZlKCduYXZpZ2F0aW9uJywgZnVuY3Rpb24gKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICByZXN0cmljdDogXCJFXCIsXHJcbiAgICAgICAgdGVtcGxhdGVVcmw6IFwidGVtcGxhdGVzL2RpcmVjdGl2ZXMvbmF2aWdhdGlvbi5odG1sXCIsXHJcbiAgICAgICAgcmVwbGFjZTogdHJ1ZVxyXG4gICAgfVxyXG59KTsiLCIvKiBIb21lQ29udHJvbGxlciAqL1xyXG5cclxua29yaUFwcC5jb250cm9sbGVyKCdIb21lQ29udHJvbGxlcicsIFtcclxuICAgICckc2NvcGUnLFxyXG4gICAgZnVuY3Rpb24gKCRzY29wZSwgbmdEaWFsb2cpIHtcclxuICAgICAgICAvKiRzY29wZS5vcGVuTG9naW4gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG5nRGlhbG9nLm9wZW4oe1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICd0ZW1wbGF0ZXMvbG9naW4uaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5Db250cm9sbGVyJ1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9Ki9cclxuICAgIH1cclxuXSk7IiwiLyogTG9naW5Db250cm9sbGVyICovXHJcblxyXG5rb3JpQXBwLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsXHJcbiAgICBmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgfVxyXG4pOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmtvcmlBcHAuZmFjdG9yeSgnYXV0aGVudGljYXRpb24nLCBbXHJcbiAgICAnbG9jYWxTdG9yYWdlU2VydmljZScsXHJcbiAgICBmdW5jdGlvbiAobG9jYWxTdG9yYWdlU2VydmljZSkge1xyXG5cclxuICAgICAgICB2YXIga2V5ID0gJ3VzZXInO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzYXZlVXNlckRhdGEoZGF0YSkge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2VTZXJ2aWNlLnNldChrZXksIGRhdGEpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0VXNlckRhdGEoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2VTZXJ2aWNlLmdldChrZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlVXNlcigpIHtcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2xzLnVzZXInKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldEhlYWRlcnMoKSB7XHJcbiAgICAgICAgICAgIHZhciBoZWFkZXJzID0ge307XHJcbiAgICAgICAgICAgIHZhciB1c2VyRGF0YSA9IGdldFVzZXJEYXRhKCk7XHJcblxyXG4gICAgICAgICAgICBpZiAodXNlckRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGhlYWRlcnMuQXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArIHVzZXJEYXRhLmFjY2Vzc190b2tlbjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGhlYWRlcnM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc0FkbWluKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZ2V0VXNlckRhdGEoKS5pc0FkbWluO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaXNMb2dnZWRJbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuICEhZ2V0VXNlckRhdGEoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHNhdmVVc2VyOiBzYXZlVXNlckRhdGEsXHJcbiAgICAgICAgICAgIGdldFVzZXJEYXRhOiBnZXRVc2VyRGF0YSxcclxuICAgICAgICAgICAgcmVtb3ZlVXNlcjogcmVtb3ZlVXNlcixcclxuICAgICAgICAgICAgZ2V0SGVhZGVyczogZ2V0SGVhZGVycyxcclxuICAgICAgICAgICAgaXNBZG1pbjogaXNBZG1pbixcclxuICAgICAgICAgICAgaXNMb2dnZWRJbjogaXNMb2dnZWRJblxyXG4gICAgICAgIH1cclxuICAgIH1dKTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxua29yaUFwcC5mYWN0b3J5KFxyXG4gICAgJ25vdGlmaWNhdGlvbicsXHJcbiAgICBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2hvd0luZm86IGZ1bmN0aW9uIChtc2cpIHtcclxuICAgICAgICAgICAgICAgIG5vdHkoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBtc2csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdpbmZvJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0OiAndG9wQ2VudGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dDogMzAwMFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNob3dFcnJvcjogZnVuY3Rpb24gKG1zZywgc2VydmVyRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIC8vIENvbGxlY3QgZXJyb3JzIHRvIGRpc3BsYXkgZnJvbSB0aGUgc2VydmVyIHJlc3BvbnNlXHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyb3JzID0gW107XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VydmVyRXJyb3IgJiYgc2VydmVyRXJyb3IuZGF0YS5lcnJvcl9kZXNjcmlwdGlvbikge1xyXG4gICAgICAgICAgICAgICAgICAgIGVycm9ycy5wdXNoKHNlcnZlckVycm9yLmRhdGEuZXJyb3JfZGVzY3JpcHRpb24pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmIChzZXJ2ZXJFcnJvciAmJiBzZXJ2ZXJFcnJvci5kYXRhLm1vZGVsU3RhdGUpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgbW9kZWxTdGF0ZUVycm9ycyA9IHNlcnZlckVycm9yLmRhdGEubW9kZWxTdGF0ZTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wZXJ0eU5hbWUgaW4gbW9kZWxTdGF0ZUVycm9ycykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3JNZXNzYWdlcyA9IG1vZGVsU3RhdGVFcnJvcnNbcHJvcGVydHlOYW1lXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRyaW1tZWROYW1lID1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZS5zdWJzdHIocHJvcGVydHlOYW1lLmluZGV4T2YoJy4nKSArIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9yTWVzc2FnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50RXJyb3IgPSBlcnJvck1lc3NhZ2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2godHJpbW1lZE5hbWUgKyAnIC0gJyArIGN1cnJlbnRFcnJvcik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbXNnID0gbXNnICsgXCI6PGJyPlwiICsgZXJyb3JzLmpvaW4oXCI8YnI+XCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIG5vdHkoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBtc2csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdlcnJvcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxheW91dDogJ3RvcENlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDUwMDBcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5rb3JpQXBwLmZhY3RvcnkoJ3VzZXJEYXRhJywgW1xyXG4gICAgJyRodHRwJyxcclxuICAgICckcmVzb3VyY2UnLFxyXG4gICAgJ2Jhc2VTZXJ2aWNlVXJsJyxcclxuICAgICdhdXRoZW50aWNhdGlvbicsXHJcbiAgICBmdW5jdGlvbiAoJGh0dHAsICRyZXNvdXJjZSwgYmFzZVNlcnZpY2VVcmwsIGF1dGhlbnRpY2F0aW9uKSB7XHJcblxyXG4gICAgICAgIHZhciB1c2VyU2VydmljZVVybCA9IGJhc2VTZXJ2aWNlVXJsICsgJ3VzZXJzLyc7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGdldFVzZXJQcm9maWxlKCkge1xyXG4gICAgICAgICAgICB2YXIgcmVzb3VyY2UgPSAkcmVzb3VyY2UodXNlclNlcnZpY2VVcmwgKyAncHJvZmlsZScsIHt9LCB7XHJcbiAgICAgICAgICAgICAgICBnZXQ6IHtcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IGF1dGhlbnRpY2F0aW9uLmdldEhlYWRlcnMoKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS5nZXQoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHJlZ2lzdGVyVXNlcih1c2VyKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkcmVzb3VyY2UodXNlclNlcnZpY2VVcmwpXHJcbiAgICAgICAgICAgICAgICAuc2F2ZSh1c2VyKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2luVXNlcih1c2VyKSB7XHJcbiAgICAgICAgICAgIHZhciByZXNvdXJjZSA9ICRyZXNvdXJjZShiYXNlU2VydmljZVVybCArICdsb2dpbicpXHJcbiAgICAgICAgICAgICAgICAuc2F2ZSh1c2VyKTtcclxuXHJcbiAgICAgICAgICAgIHJlc291cmNlLiRwcm9taXNlXHJcbiAgICAgICAgICAgICAgICAudGhlbihcclxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3MoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGF1dGhlbnRpY2F0aW9uLnNhdmVVc2VyKGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHJlc291cmNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZWRpdFVzZXJQcm9maWxlKHVzZXIpIHtcclxuICAgICAgICAgICAgdmFyIHJlc291cmNlID0gJHJlc291cmNlKHVzZXJTZXJ2aWNlVXJsICsgJ3Byb2ZpbGUnLCB7fSwge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiBhdXRoZW50aWNhdGlvbi5nZXRIZWFkZXJzKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzb3VyY2UudXBkYXRlKHVzZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlVXNlclBhc3N3b3JkKHBhc3MpIHtcclxuICAgICAgICAgICAgdmFyIHJlc291cmNlID0gJHJlc291cmNlKGJhc2VTZXJ2aWNlVXJsICsgJ3JlcXVlc3RQYXNzd29yZFJlc2V0Jywge30sIHtcclxuICAgICAgICAgICAgICAgIHVwZGF0ZToge1xyXG4gICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IGF1dGhlbnRpY2F0aW9uLmdldEhlYWRlcnMoKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS51cGRhdGUocGFzcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XHJcbiAgICAgICAgICAgIGF1dGhlbnRpY2F0aW9uLnJlbW92ZVVzZXIoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGdldFVzZXJQcm9maWxlOiBnZXRVc2VyUHJvZmlsZSxcclxuICAgICAgICAgICAgcmVnaXN0ZXI6IHJlZ2lzdGVyVXNlcixcclxuICAgICAgICAgICAgbG9naW46IGxvZ2luVXNlcixcclxuICAgICAgICAgICAgZWRpdDogZWRpdFVzZXJQcm9maWxlLFxyXG4gICAgICAgICAgICBjaGFuZ2VQYXNzd29yZDogY2hhbmdlVXNlclBhc3N3b3JkLFxyXG4gICAgICAgICAgICBsb2dvdXQ6IGxvZ291dFxyXG4gICAgICAgIH1cclxuICAgIH1dKTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9

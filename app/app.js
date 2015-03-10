'use strict';

var koriApp = angular.module('koriApp', [
    'ngRoute',
    'ngResource',
    'LocalStorageModule',
    'validation.match',
    'ui.bootstrap.pagination'
])

    .config([
        '$routeProvider',
        'localStorageServiceProvider',
        function ($routeProvider, localStorageServiceProvider) {
            $routeProvider.when('/', {
                title: 'Home',
                templateUrl: 'templates/home.html',
                controller: 'HomeCtrl'
            });

            $routeProvider.when('/login', {
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
            });

            $routeProvider.otherwise({redirectTo: '/'});

            // Web storage settings
            localStorageServiceProvider.setStorageType('localStorage');
        }]);

koriApp.constant('baseServiceUrl', 'http://softuni-ads.azurewebsites.net/api/');
koriApp.constant('pageSize', 5);

koriApp.run(["$rootScope", "$location", "authentication", function ($rootScope, $location, authentication) {

    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });

    $rootScope.$on('$locationChangeStart', function () {
        if ($location.path().indexOf('/user/') != -1 && !authentication.isLoggedIn()) {
            // Authorization check: anonymous site visitors cannot access user routes
            $location.path('/');
        }
    });
}]);

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

        var userServiceUrl = baseServiceUrl + 'user/';

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
            return $resource(userServiceUrl + 'register')
                .save(user);
        }

        function loginUser(user) {
            var resource = $resource(userServiceUrl + 'login')
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
            var resource = $resource(userServiceUrl + 'changePassword', {}, {
                update: {
                    method: 'PUT',
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsInNlcnZpY2VzL2F1dGhlbnRpY2F0aW9uLmpzIiwic2VydmljZXMvbm90aWZpY2F0aW9uLmpzIiwic2VydmljZXMvZGF0YS91c2VyRGF0YS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7QUFFQSxJQUFBLFVBQUEsUUFBQSxPQUFBLFdBQUE7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBOzs7S0FHQSxPQUFBO1FBQ0E7UUFDQTtRQUNBLFVBQUEsZ0JBQUEsNkJBQUE7WUFDQSxlQUFBLEtBQUEsS0FBQTtnQkFDQSxPQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsWUFBQTs7O1lBR0EsZUFBQSxLQUFBLFVBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxhQUFBO2dCQUNBLFlBQUE7OztZQUdBLGVBQUEsS0FBQSxhQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsYUFBQTtnQkFDQSxZQUFBOzs7WUFHQSxlQUFBLEtBQUEsY0FBQTtnQkFDQSxPQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsWUFBQTs7O1lBR0EsZUFBQSxLQUFBLGFBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxhQUFBO2dCQUNBLFlBQUE7OztZQUdBLGVBQUEsS0FBQSxxQkFBQTtnQkFDQSxPQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsWUFBQTs7O1lBR0EsZUFBQSxLQUFBLHNCQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsYUFBQTtnQkFDQSxZQUFBOzs7WUFHQSxlQUFBLEtBQUEsd0JBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxhQUFBO2dCQUNBLFlBQUE7OztZQUdBLGVBQUEsS0FBQSxpQkFBQTtnQkFDQSxPQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsWUFBQTs7O1lBR0EsZUFBQSxVQUFBLENBQUEsWUFBQTs7O1lBR0EsNEJBQUEsZUFBQTs7O0FBR0EsUUFBQSxTQUFBLGtCQUFBO0FBQ0EsUUFBQSxTQUFBLFlBQUE7O0FBRUEsUUFBQSxrREFBQSxVQUFBLFlBQUEsV0FBQSxnQkFBQTs7SUFFQSxXQUFBLElBQUEsdUJBQUEsVUFBQSxPQUFB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QTtZQUNBLGVBQUE7OztRQUdBLE9BQUE7WUFDQSxnQkFBQTtZQUNBLFVBQUE7WUFDQSxPQUFBO1lBQ0EsTUFBQTtZQUNBLGdCQUFBO1lBQ0EsUUFBQTs7O0FBR0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIGtvcmlBcHAgPSBhbmd1bGFyLm1vZHVsZSgna29yaUFwcCcsIFtcclxuICAgICduZ1JvdXRlJyxcclxuICAgICduZ1Jlc291cmNlJyxcclxuICAgICdMb2NhbFN0b3JhZ2VNb2R1bGUnLFxyXG4gICAgJ3ZhbGlkYXRpb24ubWF0Y2gnLFxyXG4gICAgJ3VpLmJvb3RzdHJhcC5wYWdpbmF0aW9uJ1xyXG5dKVxyXG5cclxuICAgIC5jb25maWcoW1xyXG4gICAgICAgICckcm91dGVQcm92aWRlcicsXHJcbiAgICAgICAgJ2xvY2FsU3RvcmFnZVNlcnZpY2VQcm92aWRlcicsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyLCBsb2NhbFN0b3JhZ2VTZXJ2aWNlUHJvdmlkZXIpIHtcclxuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIud2hlbignLycsIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnSG9tZScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy9ob21lLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0hvbWVDdHJsJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9sb2dpbicsIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnTG9naW4nLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvbG9naW4uaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTG9naW5DdHJsJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJy9yZWdpc3RlcicsIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnUmVnaXN0ZXInLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvcmVnaXN0ZXIuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnUmVnaXN0ZXJDdHJsJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJy91c2VyL2hvbWUnLCB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ0hvbWUnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvdXNlci1ob21lLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzZXJIb21lQ3RybCdcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvdXNlci9hZHMnLCB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ015IGFkcycsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3RlbXBsYXRlcy91c2VyLWhvbWUuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVXNlckFkc0N0cmwnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIud2hlbignL3VzZXIvYWRzL3B1Ymxpc2gnLCB7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ1B1Ymxpc2ggbmV3IGFkJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL3B1Ymxpc2gtbmV3LWFkLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1B1Ymxpc2hOZXdBZEN0cmwnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIud2hlbignL3VzZXIvYWRzL2VkaXQvOmlkJywge1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICdFZGl0IGFkJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2VkaXQtYWQuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnRWRpdEFkQ3RybCdcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci53aGVuKCcvdXNlci9hZHMvZGVsZXRlLzppZCcsIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnRGVsZXRlIGFkJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndGVtcGxhdGVzL2RlbGV0ZS1hZC5odG1sJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdEZWxldGVBZEN0cmwnXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJHJvdXRlUHJvdmlkZXIud2hlbignL3VzZXIvcHJvZmlsZScsIHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAnRWRpdCB1c2VyIHByb2ZpbGUnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd0ZW1wbGF0ZXMvZWRpdC1wcm9maWxlLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0VkaXRQcm9maWxlQ3RybCdcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkcm91dGVQcm92aWRlci5vdGhlcndpc2Uoe3JlZGlyZWN0VG86ICcvJ30pO1xyXG5cclxuICAgICAgICAgICAgLy8gV2ViIHN0b3JhZ2Ugc2V0dGluZ3NcclxuICAgICAgICAgICAgbG9jYWxTdG9yYWdlU2VydmljZVByb3ZpZGVyLnNldFN0b3JhZ2VUeXBlKCdsb2NhbFN0b3JhZ2UnKTtcclxuICAgICAgICB9XSk7XHJcblxyXG5rb3JpQXBwLmNvbnN0YW50KCdiYXNlU2VydmljZVVybCcsICdodHRwOi8vc29mdHVuaS1hZHMuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpLycpO1xyXG5rb3JpQXBwLmNvbnN0YW50KCdwYWdlU2l6ZScsIDUpO1xyXG5cclxua29yaUFwcC5ydW4oZnVuY3Rpb24gKCRyb290U2NvcGUsICRsb2NhdGlvbiwgYXV0aGVudGljYXRpb24pIHtcclxuXHJcbiAgICAkcm9vdFNjb3BlLiRvbignJHJvdXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uIChldmVudCwgY3VycmVudCwgcHJldmlvdXMpIHtcclxuICAgICAgICAkcm9vdFNjb3BlLnRpdGxlID0gY3VycmVudC4kJHJvdXRlLnRpdGxlO1xyXG4gICAgfSk7XHJcblxyXG4gICAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICgkbG9jYXRpb24ucGF0aCgpLmluZGV4T2YoJy91c2VyLycpICE9IC0xICYmICFhdXRoZW50aWNhdGlvbi5pc0xvZ2dlZEluKCkpIHtcclxuICAgICAgICAgICAgLy8gQXV0aG9yaXphdGlvbiBjaGVjazogYW5vbnltb3VzIHNpdGUgdmlzaXRvcnMgY2Fubm90IGFjY2VzcyB1c2VyIHJvdXRlc1xyXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLycpO1xyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG59KTtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxua29yaUFwcC5mYWN0b3J5KCdhdXRoZW50aWNhdGlvbicsIFtcclxuICAgICdsb2NhbFN0b3JhZ2VTZXJ2aWNlJyxcclxuICAgIGZ1bmN0aW9uIChsb2NhbFN0b3JhZ2VTZXJ2aWNlKSB7XHJcblxyXG4gICAgICAgIHZhciBrZXkgPSAndXNlcic7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNhdmVVc2VyRGF0YShkYXRhKSB7XHJcbiAgICAgICAgICAgIGxvY2FsU3RvcmFnZVNlcnZpY2Uuc2V0KGtleSwgZGF0YSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRVc2VyRGF0YSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZVNlcnZpY2UuZ2V0KGtleSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiByZW1vdmVVc2VyKCkge1xyXG4gICAgICAgICAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnbHMudXNlcicpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZ2V0SGVhZGVycygpIHtcclxuICAgICAgICAgICAgdmFyIGhlYWRlcnMgPSB7fTtcclxuICAgICAgICAgICAgdmFyIHVzZXJEYXRhID0gZ2V0VXNlckRhdGEoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh1c2VyRGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaGVhZGVycy5BdXRob3JpemF0aW9uID0gJ0JlYXJlciAnICsgdXNlckRhdGEuYWNjZXNzX3Rva2VuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaGVhZGVycztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGlzQWRtaW4oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBnZXRVc2VyRGF0YSgpLmlzQWRtaW47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBpc0xvZ2dlZEluKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gISFnZXRVc2VyRGF0YSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgc2F2ZVVzZXI6IHNhdmVVc2VyRGF0YSxcclxuICAgICAgICAgICAgZ2V0VXNlckRhdGE6IGdldFVzZXJEYXRhLFxyXG4gICAgICAgICAgICByZW1vdmVVc2VyOiByZW1vdmVVc2VyLFxyXG4gICAgICAgICAgICBnZXRIZWFkZXJzOiBnZXRIZWFkZXJzLFxyXG4gICAgICAgICAgICBpc0FkbWluOiBpc0FkbWluLFxyXG4gICAgICAgICAgICBpc0xvZ2dlZEluOiBpc0xvZ2dlZEluXHJcbiAgICAgICAgfVxyXG4gICAgfV0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5rb3JpQXBwLmZhY3RvcnkoXHJcbiAgICAnbm90aWZpY2F0aW9uJyxcclxuICAgIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzaG93SW5mbzogZnVuY3Rpb24gKG1zZykge1xyXG4gICAgICAgICAgICAgICAgbm90eSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IG1zZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2luZm8nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXlvdXQ6ICd0b3BDZW50ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiAzMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc2hvd0Vycm9yOiBmdW5jdGlvbiAobXNnLCBzZXJ2ZXJFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgLy8gQ29sbGVjdCBlcnJvcnMgdG8gZGlzcGxheSBmcm9tIHRoZSBzZXJ2ZXIgcmVzcG9uc2VcclxuICAgICAgICAgICAgICAgIHZhciBlcnJvcnMgPSBbXTtcclxuICAgICAgICAgICAgICAgIGlmIChzZXJ2ZXJFcnJvciAmJiBzZXJ2ZXJFcnJvci5kYXRhLmVycm9yX2Rlc2NyaXB0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXJyb3JzLnB1c2goc2VydmVyRXJyb3IuZGF0YS5lcnJvcl9kZXNjcmlwdGlvbik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYgKHNlcnZlckVycm9yICYmIHNlcnZlckVycm9yLmRhdGEubW9kZWxTdGF0ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBtb2RlbFN0YXRlRXJyb3JzID0gc2VydmVyRXJyb3IuZGF0YS5tb2RlbFN0YXRlO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3BlcnR5TmFtZSBpbiBtb2RlbFN0YXRlRXJyb3JzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnJvck1lc3NhZ2VzID0gbW9kZWxTdGF0ZUVycm9yc1twcm9wZXJ0eU5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdHJpbW1lZE5hbWUgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lLnN1YnN0cihwcm9wZXJ0eU5hbWUuaW5kZXhPZignLicpICsgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXJyb3JNZXNzYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGN1cnJlbnRFcnJvciA9IGVycm9yTWVzc2FnZXNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvcnMucHVzaCh0cmltbWVkTmFtZSArICcgLSAnICsgY3VycmVudEVycm9yKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3JzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBtc2cgPSBtc2cgKyBcIjo8YnI+XCIgKyBlcnJvcnMuam9pbihcIjxicj5cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgbm90eSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IG1zZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2Vycm9yJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF5b3V0OiAndG9wQ2VudGVyJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGltZW91dDogNTAwMFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbik7XHJcbiIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmtvcmlBcHAuZmFjdG9yeSgndXNlckRhdGEnLCBbXHJcbiAgICAnJGh0dHAnLFxyXG4gICAgJyRyZXNvdXJjZScsXHJcbiAgICAnYmFzZVNlcnZpY2VVcmwnLFxyXG4gICAgJ2F1dGhlbnRpY2F0aW9uJyxcclxuICAgIGZ1bmN0aW9uICgkaHR0cCwgJHJlc291cmNlLCBiYXNlU2VydmljZVVybCwgYXV0aGVudGljYXRpb24pIHtcclxuXHJcbiAgICAgICAgdmFyIHVzZXJTZXJ2aWNlVXJsID0gYmFzZVNlcnZpY2VVcmwgKyAndXNlci8nO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBnZXRVc2VyUHJvZmlsZSgpIHtcclxuICAgICAgICAgICAgdmFyIHJlc291cmNlID0gJHJlc291cmNlKHVzZXJTZXJ2aWNlVXJsICsgJ3Byb2ZpbGUnLCB7fSwge1xyXG4gICAgICAgICAgICAgICAgZ2V0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiBhdXRoZW50aWNhdGlvbi5nZXRIZWFkZXJzKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzb3VyY2UuZ2V0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiByZWdpc3RlclVzZXIodXNlcikge1xyXG4gICAgICAgICAgICByZXR1cm4gJHJlc291cmNlKHVzZXJTZXJ2aWNlVXJsICsgJ3JlZ2lzdGVyJylcclxuICAgICAgICAgICAgICAgIC5zYXZlKHVzZXIpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9naW5Vc2VyKHVzZXIpIHtcclxuICAgICAgICAgICAgdmFyIHJlc291cmNlID0gJHJlc291cmNlKHVzZXJTZXJ2aWNlVXJsICsgJ2xvZ2luJylcclxuICAgICAgICAgICAgICAgIC5zYXZlKHVzZXIpO1xyXG5cclxuICAgICAgICAgICAgcmVzb3VyY2UuJHByb21pc2VcclxuICAgICAgICAgICAgICAgIC50aGVuKFxyXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gc3VjY2VzcyhkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXV0aGVudGljYXRpb24uc2F2ZVVzZXIoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzb3VyY2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBlZGl0VXNlclByb2ZpbGUodXNlcikge1xyXG4gICAgICAgICAgICB2YXIgcmVzb3VyY2UgPSAkcmVzb3VyY2UodXNlclNlcnZpY2VVcmwgKyAncHJvZmlsZScsIHt9LCB7XHJcbiAgICAgICAgICAgICAgICB1cGRhdGU6IHtcclxuICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlcnM6IGF1dGhlbnRpY2F0aW9uLmdldEhlYWRlcnMoKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiByZXNvdXJjZS51cGRhdGUodXNlcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBjaGFuZ2VVc2VyUGFzc3dvcmQocGFzcykge1xyXG4gICAgICAgICAgICB2YXIgcmVzb3VyY2UgPSAkcmVzb3VyY2UodXNlclNlcnZpY2VVcmwgKyAnY2hhbmdlUGFzc3dvcmQnLCB7fSwge1xyXG4gICAgICAgICAgICAgICAgdXBkYXRlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiBhdXRoZW50aWNhdGlvbi5nZXRIZWFkZXJzKClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gcmVzb3VyY2UudXBkYXRlKHBhc3MpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gICAgICAgICAgICBhdXRoZW50aWNhdGlvbi5yZW1vdmVVc2VyKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBnZXRVc2VyUHJvZmlsZTogZ2V0VXNlclByb2ZpbGUsXHJcbiAgICAgICAgICAgIHJlZ2lzdGVyOiByZWdpc3RlclVzZXIsXHJcbiAgICAgICAgICAgIGxvZ2luOiBsb2dpblVzZXIsXHJcbiAgICAgICAgICAgIGVkaXQ6IGVkaXRVc2VyUHJvZmlsZSxcclxuICAgICAgICAgICAgY2hhbmdlUGFzc3dvcmQ6IGNoYW5nZVVzZXJQYXNzd29yZCxcclxuICAgICAgICAgICAgbG9nb3V0OiBsb2dvdXRcclxuICAgICAgICB9XHJcbiAgICB9XSk7XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
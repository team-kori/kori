/* HomeController */

koriApp.controller('HomeController', [
    '$scope',
    '$modal',
    '$rootScope',
    function ($scope, $modal, $rootScope) {
        $scope.openLogin = function () {
            $rootScope.loginModal = $modal.open({
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            });
        };

        $scope.openRegister = function () {
            $rootScope.registerModal = $modal.open({
                templateUrl: 'templates/register.html',
                controller: 'RegisterController'
            });
        };
    }
]);

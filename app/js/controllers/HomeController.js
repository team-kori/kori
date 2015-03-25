/* HomeController */

koriApp.controller('HomeController', [
    '$scope',
    '$modal',
    function ($scope, $modal) {
        $scope.openLogin = function () {
            $modal.open({
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            });
        };

        $scope.openRegister = function () {
            $modal.open({
                templateUrl: 'templates/register.html',
                controller: 'RegisterController'
            });
        };
    }
]);
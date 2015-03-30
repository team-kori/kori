/* LoginController */

koriApp.controller('LoginController', [
    '$scope',
    '$modal',
    '$rootScope',
    'userData',
    function ($scope, $modal, $rootScope, userData) {
        $scope.openRegister = function () {
            $rootScope.loginModal.close();
            $modal.open({
                templateUrl: 'templates/register.html',
                controller: 'RegisterController'
            });
        };

        $scope.login = function () {
            userData.getUserProfile().$promise
                .then(
                function (data) {
                    console.log(data);
                }
            );
        };
    }
]);
/* Register Controller */

koriApp.controller('RegisterController', [
    '$scope',
    '$modal',
    '$rootScope',
    function ($scope, $modal, $rootScope) {
        $scope.openLogin = function () {
            $rootScope.registerModal.close();
            $modal.open({
                templateUrl: 'templates/login.html',
                controller: 'LoginController'
            });
        };
    }
]);
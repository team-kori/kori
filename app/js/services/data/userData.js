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

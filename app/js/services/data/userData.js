koriApp.factory('userData', [
    'baseServiceUrl',
    '$resource',
    function (baseServiceUrl, $resource) {

        var userServiceUrl = baseServiceUrl + 'users/';

        function getAllUsers() {
            var resource = $resource(userServiceUrl, {}, {
                get: {
                    method: 'GET',
                    headers: {
                        'X-Parse-Application-Id': "Yu16oAV3aUcjWgDzmlUWdtSwqsC95XEi3VyFuUBm",
                        'X-Parse-REST-API-Key': "ikZnx2VadIRgggxAGDGCBa3cRiLjIAWi703vKwX7"
                    }
                }
            });

            return resource.get();
        }

        return {
            getAllUsers: getAllUsers
        }
    }]);

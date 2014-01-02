app.controller('PageCtrl', function($scope, $routeParams, api, title) {
    $scope.page = {};

    $scope.load = function() {
        $scope.state = 'loading';

        var promise = api.getPage($routeParams.id);

        promise.then(function(page) {
            title.set(page.title);

            $scope.page = page;
            $scope.state = 'loaded';
        }, function(reason) {
            console.log('Failed to retrieve page: ' + reason);
        });
    };

    $scope.load();
});
app.controller('PostCtrl', function($scope, $routeParams, postService) {
    $scope.post = {};

    $scope.load = function() {
        $scope.state = 'loading';

        var promise = postService.getOne($routeParams.id);

        promise.then(function(post) {
            $scope.post = post;
            $scope.state = 'loaded';
        }, function(reason) {
            console.log('Failed to retrieve post: ' + reason);
        });
    };

    $scope.load();
});
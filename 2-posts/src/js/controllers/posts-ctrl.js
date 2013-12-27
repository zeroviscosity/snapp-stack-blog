app.controller('PostsCtrl', function($scope, postService) {
    $scope.posts = [];

    $scope.load = function() {
        $scope.state = 'loading';

        var promise = postService.getList();

        promise.then(function(posts) {
            console.log('Loaded posts');
            $scope.posts = posts;
            $scope.state = 'loaded';
        }, function(reason) {
            console.log('Failed to retrieve posts: ' + reason);
        });
    };

    $scope.load();
});
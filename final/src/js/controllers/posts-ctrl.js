app.controller('PostsCtrl', function($scope, api, title) {
    $scope.offset = 0;
    $scope.limit = 10;
    $scope.more = false;
    $scope.posts = [];

    $scope.load = function() {
        $scope.state = 'loading';

        var promise = api.getPosts($scope.offset, $scope.limit);

        promise.then(function(resp) {
            $scope.posts = $scope.posts.concat(resp.posts);
            $scope.more = resp.more;
            $scope.state = 'loaded';
            $scope.offset += $scope.limit;
        }, function(reason) {
            console.log('Failed to retrieve posts: ' + reason);
        });
    };

    title.set('Posts');
    $scope.load();
});
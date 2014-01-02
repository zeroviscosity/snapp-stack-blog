app.controller('PostCtrl', function($scope, $routeParams, $timeout, api, title) {
    $scope.post = {};

    $scope.init = function() {
        $scope.state = 'loading';

        var promise = api.getPost($routeParams.id);

        promise.then(function(post) {
            title.set(post.title);

            $scope.post = post;
            $scope.state = 'loaded';

            $timeout(function() {
                gapi.plusone.render('gplus-button');

                DISQUS.reset({
                  reload: true,
                  config: function () {
                    this.page.identifier = $routeParams.id;
                    this.page.title = title.get();
                    this.page.url = 'http://kentenglish.ca/posts/' + $routeParams.id;
                  }
                });
            });
        }, function(reason) {
            console.log('Failed to retrieve post: ' + reason);
        });
    };

    $scope.init();
});
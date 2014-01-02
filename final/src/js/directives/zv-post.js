app.directive('zvPost', function() {
    return {
        scope: {
            post: '=',
            mode: '@'
        },
        controller: [
            '$scope', '$timeout', 'markdown', function($scope, $timeout, markdown) {
                $scope.$watch('post', function() {
                    if (!!$scope.post && !!$scope.post.title) {
                        $scope.post.date = new Date($scope.post.created);
                        $scope.post.html = markdown.convert($scope.post.md);
                        $timeout(function() {
                            angular.element('pre code').each(function(i, e) {
                                hljs.highlightBlock(e)
                            });
                        });
                    }
                });
            }
        ],
        template:
            '<div class="post" data-ng-class="mode">' +
                '<h2 class="post-title">' +
                    '<a href="/posts/{{ post.id }}" data-ng-bind="post.title"></a>' +
                '</h2>' +
                '<div class="post-meta">' +
                    '<div data-ng-switch="mode" class="right">' +
                        '<div data-ng-switch-when="full">' +
                            '<div data-zv-tweet-button></div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="post-date" data-ng-bind="post.date | date:fullDate"></div>' +
                '</div>' +
                '<div class="post-content" data-ng-bind-html="post.html"></div>' +
                '<div class="post-read-more">' +
                    '<h5><a href="/posts/{{ post.id }}">Continue reading...</a></h5>' +
                '</div>' +
            '</div>'
    };
});

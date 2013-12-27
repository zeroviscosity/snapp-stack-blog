app.directive('zvPost', function() {
    return {
        scope: {
            post: '='
        },
        controller: [
            '$scope', '$timeout', 'markupService', function($scope, $timeout, markupService) {
                $scope.state = 'loading';

                $scope.$watch('post', function() {
                    if (!!$scope.post && !!$scope.post.title) {
                        $scope.post.date = new Date($scope.post.created);
                        $scope.post.content = markupService.convert($scope.post.content);
                        $scope.state = 'loaded';
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
            '<div data-ng-switch="state">' +
                '<div data-ng-switch-when="loading">' +
                    '<div data-zv-loading></div>' +
                '</div>' +
                '<div data-ng-switch-when="loaded" class="post">' +
                    '<h2 class="post-title">' +
                        '<a href="/posts/{{ post.id }}" data-ng-bind="post.title"></a>' +
                    '</h2>' +
                    '<div class="post-meta">' +
                        '<div class="post-date" data-ng-bind="post.date | date:fullDate"></div>' +
                    '</div>' +
                    '<div class="post-content" data-ng-bind-html="post.content"></div>' +
                '</div>' +
            '</div>'
    };
});

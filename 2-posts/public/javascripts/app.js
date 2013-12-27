'use strict';

var app = angular.module('app', ['ngRoute', 'ngSanitize']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/assets/templates/posts.html'
    }).when('/posts/:id', {
        templateUrl: '/assets/templates/post.html'
    }).when('/about', {
        templateUrl: '/assets/templates/about.html'
    }).otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode(true).hashPrefix('!');
}]);

;app.factory('markupService', [function() {
    var converter = new Showdown.converter();

    return {
        convert: function(md) {
            return converter.makeHtml(md);
        }
    };
}]);
;app.factory('postService', ['$http', '$q', '$timeout', function($http, $q, $timeout) {
    var cache = {};

    return {
        getOne: function(id) {
            var deferred = $q.defer();

            if (cache[id]) {
                $timeout(function() {
                    deferred.resolve(cache[id]);
                });
            } else {
                $http.get('/api/posts/' + id).success(function(post) {
                    cache[post.id] = post;
                    deferred.resolve(post);
                }).error(function(data, status, headers, config) {
                    deferred.reject(data);
                });
            }

            return deferred.promise;
        },
        getList: function() {
            var deferred = $q.defer();

            $http.get('/api/posts').success(function(posts) {
                angular.forEach(posts,function(post) {
                    cache[post.id] = post;
                });
                deferred.resolve(posts);
            }).error(function(data, status, headers, config) {
                deferred.reject(data);
            });

            return deferred.promise;
        }
    };
}]);
;app.controller('PostCtrl', function($scope, $routeParams, postService) {
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
;app.controller('PostsCtrl', function($scope, postService) {
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
;app.directive('zvLoading', function() {
    return {
        template:
            '<div class="zv-loading-wrapper">' +
                '<div class="zv-loading zv-loading-1"></div>' +
                '<div class="zv-loading zv-loading-2"></div>' +
                '<div class="zv-loading zv-loading-3"></div>' +
                '<div class="zv-loading zv-loading-4"></div>' +
            '</div>'
    };
});

;app.directive('zvPost', function() {
    return {
        scope: {
            post: '=',
            mode: '@'
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
                '<div data-ng-switch-when="loaded" class="post" data-ng-class="mode">' +
                    '<h2 class="post-title">' +
                        '<a href="/posts/{{ post.id }}" data-ng-bind="post.title"></a>' +
                    '</h2>' +
                    '<div class="post-meta">' +
                        '<div class="post-date" data-ng-bind="post.date | date:fullDate"></div>' +
                    '</div>' +
                    '<div class="post-content" data-ng-bind-html="post.content"></div>' +
                    '<div class="post-read-more">' +
                        '<h5><a href="/posts/{{ post.id }}">Continue reading...</a></h5>' +
                    '</div>' +
                '</div>' +
            '</div>'
    };
});

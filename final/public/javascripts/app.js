'use strict';

var app = angular.module('app', ['ngRoute', 'ngSanitize']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/posts', {
        templateUrl: '/assets/templates/posts.html'
    }).when('/posts/:id', {
        templateUrl: '/assets/templates/post.html'
    }).when('/pages/:id', {
        templateUrl: '/assets/templates/page.html'
    }).otherwise({
        redirectTo: '/posts'
    });

    $locationProvider.html5Mode(true).hashPrefix('!');
}]);

;app.factory('api', ['$http', '$q', '$timeout', function($http, $q, $timeout) {
    var cache = {
        pages: {},
        posts: {}
    };

    return {
        getPage: function(id) {
            var deferred = $q.defer();

            if (cache.pages[id]) {
                $timeout(function() {
                    deferred.resolve(cache.pages[id]);
                });
            } else {
                $http.get('/api/published/' + id).success(function(page) {
                    cache.pages[page.id] = page;
                    deferred.resolve(page);
                }).error(function(data, status, headers, config) {
                    deferred.reject(data);
                });
            }

            return deferred.promise;
        },
        getPost: function(id) {
            var deferred = $q.defer();

            if (cache.posts[id]) {
                $timeout(function() {
                    deferred.resolve(cache.posts[id]);
                });
            } else {
                $http.get('/api/published/' + id).success(function(post) {
                    cache.posts[post.id] = post;
                    deferred.resolve(post);
                }).error(function(data, status, headers, config) {
                    deferred.reject(data);
                });
            }

            return deferred.promise;
        },
        getPosts: function(offset, limit) {
            var deferred = $q.defer();

            $http.get('/api/posts/' + offset + '/' + limit + 1).success(function(posts) {
                var more = (posts.length === limit + 1);

                posts = posts.slice(0, limit);

                angular.forEach(posts,function(post) {
                    cache.posts[post.id] = post;
                });

                deferred.resolve({
                    posts: posts,
                    more: more
                });
            }).error(function(data, status, headers, config) {
                deferred.reject(data);
            });

            return deferred.promise;
        }
    };
}]);
;app.factory('markdown', [function() {
    var converter = new Showdown.converter();

    return {
        convert: function(md) {
            return converter.makeHtml(md);
        }
    };
}]);
;app.factory('title', ['$window', function($window) {
    var base = 'Kent English: ';

    return {
        get: function() {
            return $window.document.title;
        },
        set: function(title) {
            $window.document.title = base + title;
        }
    };
}]);
;app.controller('PageCtrl', function($scope, $routeParams, api, title) {
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
;app.controller('PostCtrl', function($scope, $routeParams, $timeout, api, title) {
    $scope.post = {};

    $scope.init = function() {
        $scope.state = 'loading';

        var promise = api.getPost($routeParams.id);

        promise.then(function(post) {
            title.set(post.title);

            $scope.post = post;
            $scope.state = 'loaded';

            $timeout(function() {
                DISQUS.reset({
                  reload: true,
                  config: function () {
                    this.page.identifier = $routeParams.id;
                    this.page.title = title.get();
                    this.page.url = 'http://kentenglish.ca/posts/' + $routeParams.id;
                  }
                }, 1000);
            });
        }, function(reason) {
            console.log('Failed to retrieve post: ' + reason);
        });
    };

    $scope.init();
});
;app.controller('PostsCtrl', function($scope, api, title) {
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
                            '<iframe allowtransparency="true" frameborder="0" scrolling="no" ' +
                                    'src="https://platform.twitter.com/widgets/tweet_button.html?via=kentenglish" ' +
                                    'style="width:130px; height:20px;"></iframe>' +
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

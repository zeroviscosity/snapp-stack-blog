app.factory('api', ['$http', '$q', '$timeout', function($http, $q, $timeout) {
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
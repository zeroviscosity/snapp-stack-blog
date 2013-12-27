app.factory('postService', ['$http', '$q', '$timeout', function($http, $q, $timeout) {
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
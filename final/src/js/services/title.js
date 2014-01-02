app.factory('title', ['$window', function($window) {
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
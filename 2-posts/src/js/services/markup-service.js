app.factory('markupService', [function() {
    var converter = new Showdown.converter();

    return {
        convert: function(md) {
            return converter.makeHtml(md);
        }
    };
}]);
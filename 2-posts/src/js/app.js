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

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

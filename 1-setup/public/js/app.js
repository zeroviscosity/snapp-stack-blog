'use strict';

var app = angular.module('app', ['ngRoute', 'ngSanitize']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        redirectTo: '/about'
    }).when('/about', {
        templateUrl: '/assets/templates/about.html'
    }).otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode(true).hashPrefix('!');
}]);

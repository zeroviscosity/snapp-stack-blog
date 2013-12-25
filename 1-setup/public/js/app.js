'use strict';

var app = angular.module('app', ['ngRoute', 'ngSanitize']);

app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: '/list'
    }).otherwise({
        redirectTo: '/'
    });

    $locationProvider.html5Mode(true).hashPrefix('!');
}]);

'use strict';

angular.module('presidentApp', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'highcharts-ng',
  'ui.bootstrap',
  'ngGrid'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
	  
	  $locationProvider.html5Mode(false);
  });

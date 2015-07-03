'use strict';

angular.module('presidentApp', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'highcharts-ng',
  'ui.bootstrap',
  'ngGrid'
])
.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
	$locationProvider.html5Mode(false);
	
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
	  
  }]);

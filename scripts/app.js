'use strict';

angular.module('vantageApp', [
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'highcharts-ng',
  'ui.bootstrap',
  'ngGrid'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

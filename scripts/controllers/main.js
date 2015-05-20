'use strict';

angular.module('presidentApp')
  .controller('MainCtrl', function ($scope, $http, $filter, $modal) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    $scope.items = [];
    $scope.chartData = [];
    $scope.chartConfig = {};

    $scope.filteredItems;

    $scope.candidateResult = [];
    $scope.candidateDefs = 
                  [{ field: 'candidate_id', displayName: 'Candidate ID', width: "150"},
                   { field: 'total_contributions', displayName: 'Total Contributions', width: "150" },
                   { field: 'total_receipts_party_rank', displayName: 'Party rank (total receipts)', width: "200" }];
    $scope.gridOptions = { data: 'candidateResult', columnDefs: 'candidateDefs' };

    $scope.getItems = function() {
      $http.jsonp('http://api.nytimes.com/svc/elections/us/v3/finances/2008/president/totals.json?api-key=795366de44eab5fca0437c24982da935:14:48908840&callback=JSON_CALLBACK').success(function (data) {
        $scope.items = data;
      });
    };

    $scope.getItems();

    // watch the expression, and update the UI on change.
    $scope.$watchCollection('filteredItems', function () {
      var candidateData = [];
      var names = [];
      if ($scope.chartConfig.options.chart.type == 'bar') {
        if ($scope.filteredItems) {
          for (var i = 0; i < $scope.filteredItems.length; i++) {
              var receipt = []
              receipt = parseInt($scope.filteredItems[i].total_receipts);
              candidateData.push(receipt);
              names.push($scope.filteredItems[i].candidate_name);
          }
          if ($scope.chartConfig.series) {
            $scope.chartConfig.series[0].data = candidateData;
            $scope.chartConfig.xAxis.categories = names;
          }
        }
      }
    });

    $scope.pieChartConfig = function (chartType, data, name, titleText, options) {
      $scope.chartConfig = {
        options: {
            chart: {
                type: chartType
            }
        },
        series: [{
            data: data,
            name: name
        }],
        title: {
          text: titleText
        },
        plotOptions: {
          pie: {
             allowPointSelect: true,
             cursor: 'pointer',
         }
        }, 
        loading: false
      }
    };

    $scope.barChartConfig = function (chartType, data, name, titleText, options) {
      $scope.chartConfig = {
        chart: {
            renderTo: 'container',
        },
        options: {
            chart: {
                type: chartType
            }
        },
        series: [{
            data: data,
        }],
        xAxis: {
          categories: name, 
          },
          title: {
              text: titleText
          },

        loading: false
      }  
    };

    $scope.partySpend = function (data) {
      var demSpend = 0;
      var repubSpend= 0;

      for (var i = 0; i < data.results.length; i++) {
        if (data.results[i].party == "D") {
          demSpend += parseInt(data.results[i].total_receipts);
        } else {
          repubSpend += parseInt(data.results[i].total_receipts);
        }
      }
  		var totalSpend = [['Democrats',demSpend],['Republicans', repubSpend]];
      $scope.pieChartConfig('pie', totalSpend, 'Party Spend', 'US 2008 Campaign Spend by Party');
    };

    $scope.candidateReceipts = function (data) {
  		var candidateData = [];
  		var names = [];
      for (var i = 0; i < data.length; i++) {
  				var receipt = []
  				receipt = parseInt(data[i].total_receipts);
  				candidateData.push(receipt);
  				names.push(data[i].candidate_name);
      }
      $scope.barChartConfig('bar', candidateData, names, 'US 2008 Campaign Total Receipts by Candidate');
    };

    if ($scope.items) {
      $scope.candidateReceipts($scope.items);
    }

    $scope.candidateSearch = function(name) {
      var lname = name.split(',', 1);
      $http.jsonp('http://api.nytimes.com/svc/elections/us/v3/finances/2008/president/candidates/' 
        + lname + '.json?query=&api-key=795366de44eab5fca0437c24982da935:14:48908840&callback=JSON_CALLBACK').success(function (data) {
        var candidateData = {};
        candidateData.candidate_id = data.results[0].candidate_id;
        candidateData.total_contributions = data.results[0].total_contributions;
        candidateData.total_receipts_party_rank = data.results[0].total_receipts_party_rank;
        $scope.candidateResult = [candidateData];
      });
    };
});
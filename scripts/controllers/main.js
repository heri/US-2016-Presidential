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
      $http.jsonp('http://api.nytimes.com/svc/elections/us/v3/finances/2015/president/totals.json?api-key=795366de44eab5fca0437c24982da935:14:48908840&callback=JSON_CALLBACK').success(function (data) {
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
              var receipt = [];
              receipt = parseInt($scope.filteredItems[i].total_receipts);
              candidateData.push(receipt);
              names.push($scope.filteredItems[i].candidate_name);
          }
          if ($scope.chartConfig.series) {
            $scope.chartConfig.series[0].data = candidateData;
            $scope.chartConfig.series[0].name = 'Candidate Receipts total';
			$scope.chartConfig.series[0].showInLegend = false;
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
	  var allSpend= 0;

      for (var i = 0; i < data.results.length; i++) {
        if (data.results[i].party == "D") {
          demSpend += parseInt(data.results[i].total_receipts);
        } else {
          repubSpend += parseInt(data.results[i].total_receipts);
        }
      }
  		var totalSpend = [['Democrats',demSpend],['Republicans', repubSpend]];
      $scope.pieChartConfig('pie', totalSpend, 'Party Spend', 'US 2015 Campaign Spend by Party');
	  $scope.allSpend = demSpend + repubSpend;
    };

    $scope.candidateReceipts = function (data) {
  		var candidateData = [];
  		var names = [];
		var totalSpend = 0;

      for (var i = 0; i < data.length; i++) {
		  	var receipt = []
  				receipt = parseInt(data[i].total_receipts);
  				candidateData.push(receipt);
  				names.push(data[i].candidate_name);
				totalSpend += receipt;
      }

      $scope.barChartConfig('bar', candidateData, names, 'US 2015 Campaign Total Receipts by Candidate');
	  $scope.allSpend = totalSpend;

    };

    if ($scope.items) {
		$scope.candidateReceipts($scope.items);

    }

    $scope.candidateSearch = function(name) {
      var lname = name.split(',', 1);
      $http.jsonp('http://api.nytimes.com/svc/elections/us/v3/finances/2015/president/candidates/'
        + lname + '.json?query=&api-key=795366de44eab5fca0437c24982da935:14:48908840&callback=JSON_CALLBACK').success(function (data) {

        var candidateData = {};
        candidateData.candidate_id = data.results[0].candidate_id;
        candidateData.total_contributions = data.results[0].total_contributions;
        candidateData.total_receipts_party_rank = data.results[0].total_receipts_party_rank;
        $scope.candidateResult = [candidateData];

		$scope.candidate_details = "Candidate ID: " + candidateData.candidate_id + " Total contributions: " +  candidateData.total_contributions + " Party rank: " + candidateData.total_receipts_party_rank;




		$http.jsonp('http://api.nytimes.com/svc/elections/us/v3/finances/2015/candidates/'
		+ candidateData.candidate_id + '48hour.json?query=&api-key=795366de44eab5fca0437c24982da935:14:48908840&callback=JSON_CALLBACK').success(function (data){

			$scope.contributorDefs =
		       [{ field: 'contributor_last_name', displayName: 'Contributor name', width: "150"},
		        { field: 'contributor_employer', displayName: 'Contributor employer', width: "150" },
		        { field: 'contribution_amount', displayName: 'Contribution', width: "200" }];

			var contributorResult = {};

			for (var i = 0; i < data.length; i++) {
				var contributorData = {};
				contributorData.contributor_employer = data.results[i].contributor_employer ;
				contributorData.contributor_last_name = data.results[i].contributor_last_name ;
				contributorData.contribution_amount = data.results[i].contribution_amount ;
				contributorResult.push(contributorData);
			}

			 $scope.gridOptions = { data: 'contributorResult', columnDefs: 'contributorDefs' };




		});

      });
    };
});

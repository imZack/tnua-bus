angular.module('tnua-bus.controllers', [])

.filter('busFilter', function(TimeTableService) {
	return function(options) {
		var out = [];
		var minDiffTime = Number.MAX_VALUE;

		options = options || {};
		options.data = options.data || [];
		options.name = options.name || 'dashboard';
		options.type = options.type || 'weekday';
		options.dest = options.dest;
		options.maxDiffTime = options.maxDiffTime || Number.MAX_VALUE;

		angular.forEach(options.data, function(value, key) {
			if (value.remainingTime < 0) return;
			if (options.name != 'dashboard' && value.name.indexOf(options.name) == -1) return;
			if (TimeTableService.isSummer() && value.type.indexOf('summer_') == -1) return;
			//if (value.type != options.type) return;
			if (options.dest && value.dest.indexOf(options.dest) == -1) return;
			if (value.remainingTime > options.maxDiffTime) return;

			//if (out.length >= limits) return;

			out.push(value);
		});

		return out;
	};
})

.controller('AppCtrl', function($scope, $state, $stateParams, $filter, $translate, $ionicPopup, TimeTableService) {
	$scope.dest = 'TNUA';
	var maxDiffTime = Number.MAX_VALUE;

	TimeTableService.getData().then(function(buses) {
		$scope.busData = TimeTableService.calRemainingTime(buses);
		if ($stateParams.name == 'dashboard') {
			maxDiffTime = 3600;
			$scope.buses = $filter('busFilter')({
				data: $scope.busData,
				name: $stateParams.name,
				dest: $scope.dest,
				maxDiffTime: maxDiffTime
			});
		} else {
			maxDiffTime = Number.MAX_VALUE;
			$scope.buses = $filter('busFilter')({
				data: $scope.busData,
				name: $stateParams.name,
				dest: $scope.dest
			});
		}
		$scope.checkEmpty($scope.buses);
	});
	
	$scope.timeout = function(bus) {
		$scope.$apply(function() {
			bus.timeout = true;
		});
	};

	$scope.changeDest = function(dest) {
		$scope.dest = dest;
		$scope.buses = $filter('busFilter')({
			data: $scope.busData,
			name: $stateParams.name,
			dest: $scope.dest,
			maxDiffTime: maxDiffTime
		});
	}

	$scope.checkEmpty = function(buses) {
		if (buses.length > 0) return;
	  $ionicPopup.show({
	    title: $translate.instant('NO_BUSES'),
	    subTitle: $translate.instant('NO_BUSES_DESCR'),
	    scope: $scope,
	    buttons: [{
	    	type: 'button-positive',
	    	text: $translate.instant('THANKS'),
	    	onTap: function(e) {
	    		$state.go('bus.app', {name: 'dashboard'})
	    	}
	    }]
	  });
	}
})

.controller('AboutCtrl', function($scope, $stateParams) {
})

.factory('TimeTableService', function($http, $q) {
	var TimeTableService = {};
	var THRESHOLD = 60 * 60 * 6;

	TimeTableService.getData = function() {
		return $http.get('data.json').then(function(res) {
			var timeTable = res.data.timetable;
			for(var index in timeTable) {
				var arr = timeTable[index].time.split(':');
				var date = timeTable[index].date = new Date();
				date.setHours(arr[0]);
				date.setMinutes(arr[1]);
				date.setSeconds(3);
			}

			return timeTable
		})
	};

	TimeTableService.calRemainingTime = function(buses) {
		var tmp = new Date();
		var now = new Date(2014, 6, 23, 12, tmp.getMinutes(), tmp.getSeconds());
		angular.forEach(buses, function(bus, key) {
				bus.timeout = false;
				bus.remainingTime = ~~((bus.date.getTime() - now.getTime()) / 1000);
			});
		return buses;
	};

	TimeTableService.isSummer = function() {
		var today = new Date();
		var endSummerDay = new Date(2014, 8, 5).getTime();
		var startSummerDay = new Date(2014, 5, 23).getTime();

		if (today.getTime() > startSummerDay && today.getTime() < endSummerDay) {
			return true;
		} else {
			return false;
		}
	};

/*
	TimeTableService.getTodayType = function() {


		if (today.getTime() > startSummerDay && today.getTime() < endSummerDay) {
			if (today.getDay() == 6 || today.getDay() == 0) {
				return 'summer-weekend';
			} else {
				return 'summer-weekday';
			}
		} else {
			if (today.getDay() == 6 || today.getDay() == 0) {
				return 'weekend';
			} else {
				return 'weekday';
			}
		}
	};
*/


	return TimeTableService;
})
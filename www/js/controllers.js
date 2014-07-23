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
			if (options.name != 'dashboard') {
				if (value.name.indexOf(options.name) == -1) return;
			} else {
				if (value.remainingTime < 0) return;
				if (value.remainingTime > options.maxDiffTime) return;
			}

			// weekday
			if (TimeTableService.isWeekend) {
				if (value.type != 'weekend' && value.type.indexOf('daily') == -1) return;
			} else {
				if (value.type == 'weekend') return;
			}

			// summer filter
			if (TimeTableService.isSummer && value.type.indexOf('summer_') == -1) return;
			if (!TimeTableService.isSummer && value.type.indexOf('summer_') != -1) return;

			//if (value.type != options.type) return;
			if (options.dest && value.dest != options.dest) return;

			out.push(value);
		});

		return out;
	};
})

.controller('AppCtrl', function($scope, $state, $stateParams, $filter, $translate, $ionicPopup, TimeTableService) {
	$scope.dest = 'TNUA';
	$scope.name = $stateParams.name;
	var maxDiffTime = Number.MAX_VALUE;

	$scope.load = function() {
		TimeTableService.getData().then(function(buses) {
			$scope.busData = TimeTableService.calRemainingTime(buses);
			if ($stateParams.name == 'dashboard') {
				maxDiffTime = 3600 * 3;
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
		$scope.mode = TimeTableService.isSummer ? 'MODE_SUMMER' : 'MODE_NORMAL';
	};

	$scope.changeDest = function(dest) {
		$scope.dest = dest;
		$scope.load();	
	};

	$scope.toggleMode = function() {
		TimeTableService.isSummer = !TimeTableService.isSummer;
	};

	$scope.timeout = function(bus) {
		$scope.$apply(function() {
			bus.timeout = true;
		});
	}

	$scope.$on('toggleMode', function(event, args) {
		$scope.load();
	});

	$scope.$on('toggleWeekend', function(event, args) {
		$scope.load();
	});

	$scope.$watch('TimeTableService.isSummer', function(newValue, oldValue) {
		if (newValue == oldValue) return;
		$scope.$emit('toggleMode');
		console.log('toggleMode');
	});

	$scope.$watch('TimeTableService.isWeekend', function(newValue, oldValue) {
		if (newValue == oldValue) return;
		$scope.$emit('toggleWeekend');
		console.log('toggleWeekend');
	});

	$scope.checkEmpty = function(buses) {
		if (buses.length > 0) return;
	  var popup = $ionicPopup.show({
	    title: $translate.instant('NO_BUSES'),
	    subTitle: $translate.instant('NO_BUSES_DESCR'),
	    scope: $scope,
	    buttons: [{
	    	type: 'button-positive',
	    	text: $translate.instant('THANKS'),
	    	onTap: function(e) {
	    		if ($stateParams.name != 'dashboard') {
	    			$state.go('bus.app', {name: 'dashboard'});
	    		}
	    	}
	    }]
	  });
	}

	// bootstrap
	$scope.load();
})

.controller('MenuCtrl', function($scope, TimeTableService) {
	$scope.TimeTableService = TimeTableService;
})

.controller('AboutCtrl', function($scope, $stateParams) {
})

.factory('TimeTableService', function($http, $q) {
	var TimeTableService = {};
	var THRESHOLD = 60 * 60 * 6;
	var today = new Date();

	TimeTableService.isSummer = function() {
		var endSummerDay = new Date(2014, 8, 5).getTime();
		var startSummerDay = new Date(2014, 5, 23).getTime();
		if (today.getTime() > startSummerDay && today.getTime() < endSummerDay) {
			return true;
		} else {
			return false;
		}
	}();

	TimeTableService.isWeekend = function() {
		if (today.getDay() <5) {
			return true;
		} else {
			return true;
		}
	}();

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
		var now = new Date(2014, 6, 23, 16, tmp.getMinutes(), tmp.getSeconds());
		angular.forEach(buses, function(bus, key) {
				bus.timeout = false;
				bus.remainingTime = ~~((bus.date.getTime() - now.getTime()) / 1000);
			});
		return buses;
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
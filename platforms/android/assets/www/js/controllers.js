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

.controller('AppCtrl', function($scope, $ionicLoading, $state, $stateParams, $filter, $translate, $ionicPopup, TimeTableService) {
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
		$ionicLoading.show({
			template: $translate.instant('SWITCH_TO') + ' ' + $translate.instant($scope.mode), noBackdrop: true, duration: 2000
		});
	});

	$scope.$on('toggleWeekend', function(event, args) {
		$scope.load();
		var text = TimeTableService.isWeekend ? 'weekend' : 'weekday';
		$ionicLoading.show({
			template: $translate.instant('SWITCH_TO') + ' ' + $translate.instant(text), noBackdrop: true, duration: 2000
		});
	});

	$scope.$watch('TimeTableService.isSummer', function(newValue, oldValue) {
		if (newValue == oldValue) return;
		$scope.$emit('toggleMode');
	});

	$scope.$watch('TimeTableService.isWeekend', function(newValue, oldValue) {
		if (newValue == oldValue) return;
		$scope.$emit('toggleWeekend');
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
	    		;
	    	}
	    }]
	  });
	}

	// bootstrap
	$scope.load();
})

.controller('MenuCtrl', function($scope, $translate, TimeTableService) {
	$scope.TimeTableService = TimeTableService;
	$scope.english = window.localStorage['english'] === 'true';

	$scope.changeEnglish = function() {
		$scope.english = !$scope.english;
		if ($scope.english) {
			$translate.use('en_US');
		} else {
			$translate.use('zh_TW');
		}
		window.localStorage['english'] = $scope.english;
	}

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
		if (today.getDay() <=5) {
			return false;
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
		//var tmp = new Date();
		//var now = new Date(2014, 6, 24, 12, tmp.getMinutes(), tmp.getSeconds());
		var now = new Date();
		angular.forEach(buses, function(bus, key) {
				bus.timeout = false;
				bus.remainingTime = ~~((bus.date.getTime() - now.getTime()) / 1000);
			});
		return buses;
	};

	return TimeTableService;
})
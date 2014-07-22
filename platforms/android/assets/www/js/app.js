// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('tnua-bus', ['ngAnimate', 'ionic', 'timer', 'pascalprecht.translate', 'tnua-bus.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function ($translateProvider) {
  $translateProvider.translations('en', {
    APP_NAME: 'TNUA BUS APP',
    ABOUT: 'About',
    SETTINGS: 'Settings',
    MINUTES: 'minutes',
    TIME_NO: 'Time',
    TO: 'to',
    TNUA: 'TNUA',
    Kuandu_MRT: 'Kuandu MRT',
    weekday: 'Weekday',
    special: 'Special',
    summer_weekday: 'Summer Weekday',
    summer_daily: 'Summer Daily',
    dashboard: 'Dashboard',
    red35: 'RED 35',
    red55: 'RED 55',
    shuttlebus: 'Shuttle Bus',
    NO_BUSES: 'No buses.',
    NO_BUSES_DESCR: 'Please select others.',
    THANKS: 'Thanks'
  });
  $translateProvider.translations('zh-TW', {
    APP_NAME: '北藝大校車 APP',
    ABOUT: '關於',
    SETTINGS: '設定',
    MINUTES: '分',
    TIME_NO: '班次',
    TO: '往',
    TNUA: '北藝大',
    Kuandu_MRT: '關渡捷運站',
    weekday: '平日',
    special: '專車',
    summer_weekday: '暑假平日',
    summer_daily: '暑假每日',
    dashboard: '總覽',
    red35: '紅 35',
    red55: '紅 55',
    shuttlebus: '校車',
    NO_BUSES: '沒有車輛',
    NO_BUSES_DESCR: '請選擇其他項目',
    THANKS: '謝謝'
  });
  $translateProvider.preferredLanguage('zh-TW');
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('bus', {
      url: "/bus",
      abstract: true,
      templateUrl: "templates/menu.html"
    })
    .state('bus.about', {
      url: "/about",
      views: {
        'menuContent' :{
          templateUrl: "templates/about.html",
          controller: 'AboutCtrl'
        }
      }
    })
    .state('bus.app', {
      url: "/:name",
      views: {
        'menuContent' :{
          templateUrl: function (stateParams) {
            if (stateParams.name == 'dashboard') {
              return "templates/app.html";
            } else {
              return "templates/timetable.html";
            }
          },
          controller: 'AppCtrl'
        }
      }
    });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/bus/dashboard');
});


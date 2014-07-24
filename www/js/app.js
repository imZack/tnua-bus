// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('tnua-bus', ['ngAnimate', 'ionic', 'timer', 'pascalprecht.translate', 'tnua-bus.controllers'])

.run(function($ionicPlatform, $ionicLoading) {
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
  $translateProvider.translations('en_US', {
    APP_NAME: 'TNUA BUS APP',
    ABOUT: 'About',
    SETTINGS: 'Settings',
    MINUTES: 'minutes',
    TIME_NO: 'Time',
    TO: 'to',
    TNUA: 'TNUA',
    Kuandu_MRT: 'Kuandu MRT',
    weekday: 'Weekday',
    weekend: 'Weekend',
    special: 'Special',
    summer_weekday: 'Summer Weekday',
    summer_daily: 'Summer Daily',
    dashboard: 'Dashboard',
    red35: 'RED 35',
    red55: 'RED 55',
    shuttlebus: 'Shuttle Bus',
    NO_BUSES: 'No buses.',
    NO_BUSES_DESCR: 'Please select others.',
    THANKS: 'Thanks',
    MODE_SUMMER: 'Summer',
    MODE_NORMAL: 'Normal',
    SWITCH_TO: 'Switch to',
    RED35_DESCR: '※ The Red 35 schedule above is for reference. The cost and discount services are as the standard of Taipei city buses.<br>※ The route of Red 35 is from Taipei Chengshih University of Science and Technology and periphery of Forest Theatre to TNUA campus. The route of TNUA Shuttle Bus is from Xueyuan Rd. and Sunshine Boulevard to the campus.',
    BUS_DESCR: '※ TNUA faculty, staff, and students: 6 NT per ride；Any excess amount paid shall not be refunded to those paying incash. It is the bus rider\'s responsibility to have exact change. <br>※The TNUA Shuttle Bus only serves as the schedule above.'
  });
  $translateProvider.translations('zh_TW', {
    APP_NAME: '北藝大校車 APP',
    ABOUT: '關於',
    SETTINGS: '設定',
    MINUTES: '分',
    TIME_NO: '班次',
    TO: '往',
    TNUA: '北藝大',
    Kuandu_MRT: '關渡捷運站',
    weekday: '平日',
    weekend: '假日',
    special: '專車',
    summer_weekday: '暑假平日',
    summer_daily: '暑假每日',
    dashboard: '最近班次',
    red35: '紅 35',
    red55: '紅 55',
    shuttlebus: '校車',
    NO_BUSES: '該時段沒有車輛',
    NO_BUSES_DESCR: '請選擇其他項目',
    THANKS: '謝謝',
    MODE_SUMMER: '暑假',
    MODE_NORMAL: '正常',
    SWITCH_TO: '切換至',
    RED35_DESCR: '※ 紅35路線時間表為預估到站時間，請提早等候，搭乘費用比照一般公車標準收費或享有轉乘優惠服務。<br>※ 紅35路繞經臺北城市大學及荒山劇場再進入本校，本校接駁車經由學園路、陽關大道直接進入本校。',
    BUS_DESCR: '※ 本校教職員生：每次收費新臺幣6元；未持悠遊卡者，應自備零錢，不找零。<br>※ 由於行車調度及配合班次表，接駁車於非發車時刻恕無法提供載客服務，請各位教職員生見諒，感謝您的配合！'
  });

  if (window.localStorage['english'] === 'true') {
    $translateProvider.fallbackLanguage('en_US');
    $translateProvider.preferredLanguage('en_US');
  } else {
    $translateProvider.fallbackLanguage('zh_TW')
    $translateProvider.preferredLanguage('zh_TW');
  }
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('bus', {
      url: "/bus",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: "MenuCtrl"
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


angular.module('imageQuizz', ['ionic', 'ui.utils', 'firebase', 'googlechart'])

    .config(function ($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('tabs', {
                url: "/tab",
                abstract: true,
                templateUrl: "templates/TabsView.html"
            })
            .state('tabs.home', {
                url: "/modules",
                views: {
                    'module-tab': {
                        templateUrl: "templates/ModulListView.html",
                        controller: 'ModuleListController as mlCtrl'
                    }
                }
            })
            .state('tabs.stats', {
                url: '/stats',
                views: {
                    'stats-tab': {
                        templateUrl: "templates/StatView.html",
                        controller: "StatisticController as statsCtrl"
                    }
                }
            })
            .state('tabs.settings', {
                url: '/settings',
                views: {
                    'settings-tab': {
                        templateUrl: "templates/SettingView.html",
                        controller: "SettingsController as stCtrl"
                    }
                }
            })
            .state('question_list', {
                url: '/questionlist/:id',
                templateUrl: 'templates/QuestionListView.html',
                controller: 'QuestionListController as qlCtrl'
            })
            .state('question_view', {
                url: '/questionview/:id',
                templateUrl: 'templates/QuestionView.html',
                controller: 'QuestionController as qCtrl'
            })
            .state('question_view_quizz', {
                url: '/questionview/quizz/:id',
                templateUrl: 'templates/QuestionView.html',
                controller: 'QuizzController as qCtrl'
            });
        $urlRouterProvider.otherwise("/tab/modules");

    })
    .run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
    });

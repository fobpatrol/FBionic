(function () {
    'use strict';
    angular.module('starter').config(routes);

    function routes($stateProvider, $urlRouterProvider, $translatePartialLoaderProvider) {

        // Translation
        $translatePartialLoaderProvider.addPart('app/');

        $stateProvider

            .state('loading', {
                url         : '/',
                templateUrl : 'app/main/loading/loading.html',
                controller  : 'LoadingCtrl',
                controllerAs: 'vm'
            })

            .state('walkthrough', {
                url         : '/walkthrough',
                templateUrl : 'app/main/walkthrough/walkthrough.html',
                controller  : 'WalkthroughCtrl',
                controllerAs: 'vm'
            })

            .state('user', {
                url        : '/user',
                abstract   : true,
                templateUrl: 'app/main/user-layout/user-layout.html'
            })

            .state('user.avatar', {
                url         : '/avatar',
                templateUrl : 'app/main/user-avatar/user-avatar.html',
                controller  : 'UserAvatarCtrl',
                controllerAs: 'vm'
            })

            .state('user.register', {
                url         : '/register',
                templateUrl : 'app/main/user-register/user-register.html',
                controller  : 'UserRegisterCtrl',
                controllerAs: 'vm'
            })

            .state('user.login', {
                url         : '/login',
                templateUrl : 'app/main/user-login/user-login.html',
                controller  : 'UserLoginCtrl',
                controllerAs: 'vm'
            })

            .state('user.merge', {
                url         : '/merge',
                controller  : 'UserMergeCtrl',
                controllerAs: 'vm',
                templateUrl : 'app/main/user-merge/merge.html'
            })

            .state('logout', {
                url         : '/logout',
                template    : '<ion-view view-title="Logout" cache-view="false"><ion-content></ion-content></ion-view>',
                controller  : function (Auth, $state) {
                    Auth.logOut();
                    $state.go('user.login', {clear: true});
                },
                controllerAs: 'vm'
            })

            .state('tab', {
                url         : '/tab',
                abstract    : true,
                controller  : 'MainTabCtrl',
                controllerAs: 'vm',
                templateUrl : 'app/main/tab/main-tab.html'
            })

            .state('tab.home', {
                url  : '/home',
                views: {
                    tabHome: {
                        controller  : 'HomeCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/tab-home/home.html'
                    }
                }
            })

            .state('tab.search', {
                url  : '/search',
                views: {
                    tabSearch: {
                        controller  : 'SearchCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/tab-search/search.html',
                    }
                }
            })

            .state('tab.map', {
                url  : '/map',
                views: {
                    tabSearch: {
                        controller  : 'SearchMapCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/tab-search-map/searchMap.html',
                    }
                }
            })

            .state('tab.account', {
                url  : '/account',
                views: {
                    tabProfile: {
                        controller  : 'AccountCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/tab-account/account.html'
                    }
                }
            })

            .state('tab.activity', {
                url  : '/activity',
                views: {
                    tabActivity: {
                        controller  : 'ActivityCtrl',
                        controllerAs: 'vm',
                        templateUrl : 'app/main/tab-activity/activity.html'
                    }
                }
            })

        ;

        // Translation
        //$translatePartialLoaderProvider.addPart('app/main');
        $urlRouterProvider.otherwise('/');

    }


})();
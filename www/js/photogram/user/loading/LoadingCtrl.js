(function (window, angular, undefined) {
    'use strict';
    /**
     * @ngdoc controller
     * @name LoadingCtrl
     *
     * @description
     * _Please update the description and dependencies._
     *
     * @requires $scope
     * */
    angular
        .module('app.photogram')
        .controller('LoadingCtrl', LoadingController);

    function LoadingController ($rootScope, AppConfig, $state) {
        var user = $rootScope.user;
        console.log('User', user);

        if (user) {
            console.log(user);
            if (user.name) {
                $state.go(AppConfig.routes.home, {
                    clear: true
                });
            } else {
                $state.go('useravatar', {
                    clear: true
                });
            }
        } else {
            $state.go('intro', {
                clear: true
            });
        }
    }


}) (window, window.angular);
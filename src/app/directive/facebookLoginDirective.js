(function () {
  'use strict';

  angular.module('starter').directive('facebookLogin', facebookLoginDirective);

  function facebookLoginDirective(Loading, $state, $q, $translate, AppConfig, Facebook, Dialog, User, $rootScope) {
    return {
      restrict: 'E',
      link:     facebookLoginLink,
      template: '<button class="button button-block button-facebook"><i class="icon ion-social-facebook"></i> <ion-spinner ng-if="loading"></ion-spinner> <span ng-if="!loading">{{ me.name || \'loginWithFacebook\'| translate}}</span> </button>',
    };

    function facebookLoginLink(scope, elem, attr) {

      scope.facebookStatus = null;

      elem.bind('click', onLoginViaFacebook);


      function onLoginViaFacebook() {

        Facebook.getCurrentUser().then(function (response) {

          if (response.status === 'connected') {
            processFacebookLogin(response);
          } else {
            Facebook.logIn().then(function (authData) {
              processFacebookLogin(authData);
            }).catch(eventError);
          }
        }).catch(eventError);
      }

      function successLogin(newUser) {
        $rootScope.currentUser = Parse.User.current();
        $rootScope.$broadcast('onUserLogged');
        Loading.end();

        if (newUser) {
          $state.go('avatar', {clear: true});
        } else {
          $state.go(AppConfig.routes.home, {clear: true});
        }
        Loading.end();
      }

      function processFacebookLogin(authData) {
        Loading.start('Conectando com o Facebook');

        Facebook.me().then(function (fbData) {
          var facebookAuthData = {
            id:              authData['authResponse']['userID'],
            access_token:    authData['authResponse']['accessToken'],
            expiration_date: (new Date().getTime() + 1000).toString()
          };

          Parse.FacebookUtils.logIn(facebookAuthData)
            .then(function (user) {
              var newUser = user.existed();

              User.facebookSyncProfile(fbData)
                .then(User.updateWithFacebookData)
                .then(successLogin(newUser));

            });
        }).catch(eventError);
      }

      function eventError(error) {
        console.log('error', error);
        Loading.end();
        Dialog.alert(error);
      }

    }
  }

})();

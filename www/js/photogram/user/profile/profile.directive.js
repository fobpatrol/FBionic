(function (window, angular, undefined) {
    'use strict';
    angular
        .module('app.photogram')
        .directive('photogramProfile', photogramProfile);

    function photogramProfile($ionicModal, $q, AppConfig, Photogram, User) {
        var path = AppConfig.path;

        return {
            restrict: 'A',
            scope   : {
                user: '='
            },
            link    : function (scope, elem, attr) {

                elem.bind('click', openModal);

                function init() {
                    var defer              = $q.defer();
                    scope.loadingPhotogram = true;

                    Photogram
                        .getUserGallery(scope.user.id)
                        .then(function (resp) {
                            scope.data = resp;
                            console.log(resp);
                            scope.$broadcast('scroll.refreshComplete');
                            scope.$broadcast('scroll.infiniteScrollComplete');
                            scope.loadingPhotogram = false;
                            defer.resolve(scope.data);
                        });

                    return defer.promise;
                }

                function getFollower(userId) {
                    scope.loadingFollowers = true;
                    scope.loadingFollowing = true;
                    scope.loadingPhotos    = true;

                    Photogram
                        .getUserGalleryQtd(userId)
                        .then(function (qtdPhotos) {
                            scope.user.qtdPhotos = qtdPhotos;
                            scope.loadingPhotos  = false;
                        });

                    User
                        .getFollowers(userId)
                        .then(function (qtdFollowers) {
                            console.log('qtdFollower: seguindo', qtdFollowers);
                            scope.user.qtdFollowers = qtdFollowers;
                            scope.loadingFollowers  = false;
                        });

                    User
                        .getFollowing(userId)
                        .then(function (qtdFollowing) {
                            console.log('qtdFollowing: seguidores', qtdFollowing);
                            scope.user.qtdFollowing = qtdFollowing;
                            scope.loadingFollowing  = false;
                        });
                }

                function openModal() {

                    $ionicModal
                        .fromTemplateUrl(path + '/user/profile/photogram.profile.modal.html', {
                            scope: scope
                        })
                        .then(function (modal) {
                            scope.modalProfile = modal;
                            scope.modalProfile.show();

                            init();
                            getFollower(scope.user.id);

                            scope.loadingFollow = true;
                            User
                                .isFollow(scope.user.id)
                                .then(function (resp) {
                                    console.info('follow user?', resp);
                                    scope.user.follow   = resp;
                                    scope.loadingFollow = false;
                                });

                            scope.follow = function () {

                                scope.loadingFollow = true;
                                var status;

                                if (scope.user.follow) {
                                    status = false;
                                } else {
                                    status = true;
                                }

                                User
                                    .follow(status, scope.user)
                                    .then(function (resp) {

                                        console.log('Follow result', resp);
                                        scope.user.follow   = status;
                                        scope.loadingFollow = false;
                                        getFollower(scope.user.id);
                                    });
                            };

                            scope.closeModal = function () {
                                delete scope.data;
                                scope.modalProfile.hide();
                                scope.modalProfile.remove();
                            };
                        });
                }
            }
        }
    }

})(window, window.angular);
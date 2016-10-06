(function () {
    'use strict';
    angular.module('starter').directive('photoLike', photoLikeDirective);

    function photoLikeDirective(Gallery, $timeout) {
        return {
            restrict: 'A',
            scope   : {
                ngModel: '=',
                loading: '='
            },
            link    : function (scope, elem) {
                elem.bind('click', function () {
                        if (scope.loading) return;
                        var _model      = scope.ngModel;
                        _model.progress = true;
                        _model.liked    = !_model.liked;
                        scope.loading   = true;

                        Gallery.likeGallery({galleryId: scope.ngModel.id}).then(function (resp) {
                            _model.likes    = resp.likes;
                            _model.progress = false;
                            if (resp.action === 'like') {
                                scope.ngModel.isLiked = true;
                                scope.ngModel.likesTotal += 1;
                            }

                            if (resp.action === 'unlike') {
                                scope.ngModel.isLiked = false;
                                scope.ngModel.likesTotal -= 1;
                            }

                            scope.loading = false;
                            scope.$apply();
                        });
                    }
                );

            }
        };
    }


})();

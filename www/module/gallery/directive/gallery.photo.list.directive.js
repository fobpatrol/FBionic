(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.gallery')
    .directive('galleryPhotoList', galleryPhotoList);

  function galleryPhotoList() {
    return {
      restrict: 'E',
      scope: {
        data: '=gallery',
        loading: '='
      },
      templateUrl: 'module/gallery/view/gallery.photos.list.html',
      link: function (scope, elem, attr) {

      }
    }
  }
})(window, window.angular);

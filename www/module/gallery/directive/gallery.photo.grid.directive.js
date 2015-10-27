(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.gallery')
    .directive('galleryPhotoGrid', galleryPhotoGrid);

  function galleryPhotoGrid() {
    return {
      restrict: 'E',
      scope: {
        data: '=gallery',
        loading: '='
      },
      templateUrl: 'module/gallery/view/gallery.photos.grid.html'
    }
  }
})(window, window.angular);

(function (window, angular, undefined) {
  'use strict';
  angular
    .module('app.photogram')
    .directive('photogramPhotoGrid', photogramPhotoGrid);


  function photogramPhotoGrid(AppConfig) {

    var path = AppConfig.path;

    return {
      restrict: 'E',
      scope: {
        data: '=photogram',
        loading: '='
      },
      templateUrl: path + '/directives/photogrid/photogram.photos.grid.html'
    }
  }


})(window, window.angular);
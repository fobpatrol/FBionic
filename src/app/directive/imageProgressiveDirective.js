(function () {
  'use strict';

  angular.module('starter').directive('imageProgressive', imageProgressiveDirective);

  function imageProgressiveDirective() {
    return {
      restrict: 'E',
      scope:    {
        image:    '=',
        imageLow: '='
      },
      link:     imageProgressiveLink,
      template: '<div > ' +
                  '<div >' +
                    '<img ng-src="{{imageLow}}" >' +
                  '</div>' +
                  '<img ng-src="{{image}}"  on-load-image/>' +
                '</div>'
    };

    function imageProgressiveLink($scope, elem, attr) {
      var width  = '640';
      var heigth = width;

      $scope.getOverlayStyle = function () {
        return {
          width:  width + 'px',
          heigth: heigth + 'px',
        };
      };
    }
  }

})();

(function () {
  'use strict';

  angular.module('starter').directive('onLoadImage', onLoadImageDirective);

  function onLoadImageDirective() {
    return {
      restrict: 'A',
      link:     onLoadImageLink,
      template: ''
    };

    function onLoadImageLink($scope, elem, attr) {
      elem.bind('load', function (e) {
        this.className = 'showImage';
      });
    }
  }

})();

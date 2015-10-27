(function (window, angular, undefined) {
  'use strict';
  angular
    .module('module.gallery')
    .controller('GallerySearchMapCtrl', GallerySearchMapCtrl);

  function GallerySearchMapCtrl($scope, $timeout, User, GeoService, Gallery) {
    var vm = this;
    var time = 0;
    var map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 13
    };

    vm.location = location;
    vm.openModal = openModal;
    $scope.map = map;
    $scope.$watch('map.center.latitude', watchMap);

    function watchMap(newValue, oldValue) {
      console.log(newValue);
      if (newValue) {
        console.log(newValue);
        time += 2000;
        console.log(time);


        var timer = $timeout(function () {
          console.log(timer);

          Gallery
            .nearby($scope.map.center)
            .then(function (resp) {
              console.log(resp);
              time = 0;
              vm.data = resp;

              $timeout.cancel(timer);
            });
        }, time);

      }
    }

    function openModal(item) {
      console.log(item);
    }

    function location() {
      init();
    }

    function init() {
      GeoService
        .findMe()
        .then(function (position) {

          console.log(position);

          $scope.map = {
            center: position.geolocation,
            zoom: 13
          };

          vm.user = angular.copy(position.geolocation);

          Gallery
            .nearby(position.coords)
            .then(function (resp) {
              console.log(resp);
              vm.data = resp;
            });

        }, function (error) {
          console.log('Could not get location');

          Gallery
            .nearby($scope.map.center)
            .then(function (resp) {
              console.log(resp);
              vm.data = resp;
            });
        });
    }

    init();

  }
})(window, window.angular);

(function (window, angular, ionic, undefined) {
  'use strict';
  angular
    .module('module.user')
    .controller('IntroCtrl', IntroCtrl);

  function IntroCtrl(User, Notify, Loading, $state, AppConfig, gettextCatalog) {
    var vm = this;
    var currentPlatform = ionic.Platform.platform();
    vm.slideIndex = 0;
    vm.slideChanged = slideChanged;

    if (currentPlatform) {
      vm.device = (currentPlatform == 'android') ? 'android' : 'iphone';
    } else {
      vm.device = 'android';
    }

    vm.slides = [{
        top: gettextCatalog.getString('Share your most amazing moments'),
        img: 'img/intro1.jpg'
      }, {
        top: gettextCatalog.getString('Follow your friends and relive their moments'),
        img: 'img/intro2.jpg'
      }, {
        top: gettextCatalog.getString('Find people around you and enjoy your photos'),
        img: 'img/intro3.jpg'
      }, {
        top: gettextCatalog.getString('Enjoy the most amazing photos'),
        img: 'img/intro4.jpg'
      }, {
        top: gettextCatalog.getString('Create your Social Photo Share with Ionic Framework!'),
        img: 'img/intro5.jpg'
      }

    ];

    function slideChanged(index) {
      vm.slideIndex = index;
    }


  }
})(window, window.angular, window.ionic);

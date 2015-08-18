'use strict';
angular
    .module('module.gallery')
    .controller('GalleryActivityCtrl', function (Gallery) {
        var vm     = this;
        vm.loading = true;
        Gallery
            .listActivity()
            .then(function (resp) {
                console.log(resp);
                vm.data    = resp;
                vm.loading = false;
            });
    });
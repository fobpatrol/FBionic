(function () {
    'use strict';

    angular.module('ion-photo').factory('PhotoService', PhotoServiceFactory);

    function PhotoServiceFactory($ionicActionSheet, $cordovaCapture, $cordovaCamera, $timeout, PhotoFilter, $translate, AppConfig, Share, $cordovaActionSheet, $jrCrop, $rootScope, $ionicModal, ActionSheet, $q) {

        var deviceInformation = ionic.Platform.device();
        var isIOS             = ionic.Platform.isIOS();

        console.log('isIOS', isIOS);

        // Default Setting
        var tempImage;
        var cordova = window.cordova;
        var setting = {
            jrCrop            : true,
            filterImage       : true,
            quality           : 90,
            allowEdit         : false,
            filter            : true,
            correctOrientation: true,
            targetWidth       : 320,
            targetHeight      : 320,
            saveToPhotoAlbum  : false,
            allowRotation     : false,
            aspectRatio       : 0
        };


        return {
            open  : openModal,
            crop  : cropModal,
            filter: filterModal
        };

        function filterModal(image) {
            var defer = $q.defer();

            if (setting.filterImage) {
                openFilter(image);
            } else {
                defer.resolve(image);
            }

            function openFilter(image64) {
                var scope  = $rootScope.$new(true);
                tempImage  = image64;
                scope.form = {
                    photo: image64
                };

                scope.theme = $rootScope.theme;
                $ionicModal.fromTemplateUrl('app/component/ion-photo/view/filter.modal.html', {
                    scope          : scope,
                    focusFirstInput: true
                }).then(function (modal) {
                    scope.modalFilter = modal;
                    scope.modalFilter.show();
                    scope.loading = true;
                    $timeout(function () {
                        PhotoFilter.init('image', image64).then(function () {
                            scope.loading = false;
                        });
                    }, 500)
                });

                scope.actionShowFilter = function (option) {
                    scope.showFilter = option;
                };

                scope.closeModalFilter = function () {
                    scope.modalFilter.hide();
                };

                scope.cropImage = function () {
                    scope.modalFilter.remove();
                    cropModal(tempImage)
                        .then(openFilter);
                };

                // Filter
                scope.filters      = PhotoFilter.filters.Adjust;
                scope.imageFilters = PhotoFilter.imageFilters;
                scope.reset        = PhotoFilter.reset;

                scope.applyFilter = function (filter) {
                    PhotoFilter.apply(filter.filter);
                };

                scope.filterEdit = false;
                scope.showFilter = true;

                scope.selectFilter = function (filter) {
                    console.log('filter', filter);
                    scope.filter     = filter;
                    scope.filterEdit = true;
                };

                scope.doneFilter = function () {
                    scope.filterEdit = false;
                };

                scope.cancelFilter = function (filter) {
                    filter.slider.value = 0;
                    filter.setSlider(filter.slider);
                    scope.filterEdit = false;
                };

                scope.$watch('scope.filterSelected', function (item) {
                    if (item) {
                        var filter    = _.find(scope.filters, {func: item});
                        scope.filter  = filter;
                        scope.sliders = filter.sliders;
                        console.log(filter);
                    }
                });

                scope.$watch('filter.slider.value', function (value) {
                    if (value) {
                        scope.filter.slider.value = parseInt(value);
                        scope.filter.setSlider(scope.filter.slider);
                    }
                });

                scope.closeFilter = function () {
                    defer.reject();
                    scope.modalFilter.hide();
                };

                scope.submitFilter = function () {
                    var dataUrl = PhotoFilter.getImage();
                    scope.modalFilter.remove();
                    defer.resolve(dataUrl);
                };


                // Cleanup the modal when we're done with it!
                scope.$on('$destroy', function () {
                    scope.modal.remove();
                });
            }

            return defer.promise;
        }

        function openModal(setOptions) {
            var defer = $q.defer();
            console.log(deviceInformation);

            // Change Settings
            if (setOptions) {
                setOptions.each(function (value, key) {
                    setting[key] = value;
                });
            }

            var options     = {
                quality           : setting.quality,
                aspectRatio       : setting.aspectRatio,
                allowRotation     : setting.allowRotation,
                allowEdit         : setting.allowEdit,
                correctOrientation: setting.correctOrientation,
                targetWidth       : setting.targetWidth,
                targetHeight      : setting.targetHeight,
                saveToPhotoAlbum  : setting.saveToPhotoAlbum,
                destinationType   : window.cordova ? Camera.DestinationType.DATA_URL : null,
                encodingType      : window.cordova ? Camera.EncodingType.JPEG : null,
                popoverOptions    : window.cordova ? CameraPopoverOptions : null,
            };
            var buttons     = [
                {
                    text: '<i class="icon ion-images"></i>' + $translate.instant('capturePhoto')
                },
                {
                    text: '<i class="icon ion-ios-camera"></i>' + $translate.instant('captureLibrary')
                }
            ];
            var actionSheet = $ionicActionSheet.show({
                buttons      : buttons,
                titleText    : $translate.instant('submit'),
                cancelText   : $translate.instant('cancel'),
                cancel       : buttonCancel,
                buttonClicked: buttonClicked
            });

            function buttonClicked(index) {
                console.log(index);
                actionSheet();
                capture(index, options)
                    .then(cropModal)
                    .then(filterModal)
                    .then(defer.resolve)
                    .catch(buttonCancel);
            }


            function buttonCancel(resp) {
                actionSheet(resp);
            }

            return defer.promise;
        }

        function cropModal(image) {
            var defer = $q.defer();
            if (window.cordova) {
                image = 'data:image/jpeg;base64,' + image;
            }

            if (setting.jrCrop) {
                $jrCrop.crop({
                    url          : image,
                    aspectRatio  : 1,
                    allowRotation: setting.allowRotation,
                    width        : setting.targetWidth,
                    height       : setting.targetHeight,
                    cancelText   : $translate.instant('cancel'),
                    chooseText   : $translate.instant('submit')
                }).then(function (canvas) {
                    defer.resolve(canvas.toDataURL());
                }).catch(defer.reject);
            } else {
                defer.resolve(image);
            }

            return defer.promise;
        }

        function show(params) {

            var defer = $q.defer();

            if (window.cordova) {

                var options = {
                    title                    : params.title,
                    buttonLabels             : _.map(params.options, function (item) {return item.text}),
                    addCancelButtonWithLabel : params.cancelText,
                    androidEnableCancelButton: true,
                    androidTheme             : window.plugins.actionsheet.ANDROID_THEMES.THEME_HOLO_LIGHT
                };

                $cordovaActionSheet.show(options).then(function (btnIndex) {
                    if (btnIndex !== 3) {
                        defer.resolve(btnIndex);
                    }
                    defer.reject('cancel');
                });

            } else {
                var actionSheet = $ionicActionSheet.show({
                    buttons      : params.options,
                    titleText    : params.title,
                    cancelText   : params.cancelText,
                    cancel       : function () {
                        actionSheet();
                    },
                    buttonClicked: function (btnIndex) {
                        actionSheet();
                        if (btnIndex !== 3) {
                            defer.resolve(btnIndex);
                        }
                        defer.reject('cancel');
                    }
                });

            }
            return defer.promise;
        }

        function capture(type, options) {
            var defer = $q.defer();

            // CAMERA
            if (type === 0) {
                getPicture(0);
            }

            // GALLERY
            if (type === 1) {
                getPicture(1);
            }

            // Video
            if (type === 2) {
                getVideo();
            }

            function getPicture(method) {
                if (method === 0 && cordova) options.sourceType = Camera.PictureSourceType.CAMERA;
                if (method === 1 && cordova) options.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;

                if (cordova) {
                    $cordovaCamera.getPicture(options).then(defer.resolve, defer.reject);
                } else {
                    var fileInput = angular.element('<input type="file" accept="image/x-png, image/gif, image/jpeg" max-size="2048" />');
                    fileInput[0].click();
                    fileInput.on('change', function (evt) {
                        tempImage     = evt.currentTarget.files[0];
                        var reader    = new FileReader();
                        reader.onload = function (evt) {
                            defer.resolve(evt.target.result);
                        };
                        reader.readAsDataURL(tempImage);
                    });
                }
            }

            function getVideo() {
                $cordovaCapture.captureVideo({
                    limit   : 1,
                    duration: 5
                }).then(function (mediaFiles) {
                    tempImage = mediaFiles[0].fullPath;
                    defer.resolve(tempImage);
                }, defer.reject);
            }


            return defer.promise;
        }


    }
})();

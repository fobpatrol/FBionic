describe('Controller: app.photogram.PhotogramCaptureCtrl', function () {

    // load the controller's module
    beforeEach(module('app.photogram'));

    var ctrl,
        scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        ctrl = $controller('PhotogramCaptureCtrl', {
            $scope: scope
        });
    }));

    it('should be defined', function () {
        expect(ctrl).toBeDefined();
    });
});

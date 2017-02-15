(function () {
    'use strict';
    angular.module('ionic').constant('AppConfig', AppConfig());

    function AppConfig() {
        return {
            path           : 'app/module/photogram',
            app            : {
                name : 'FarmBooth',
                url  : 'http://photogramapp.com',
                image: 'http://photogramapp.com/social-share.jpg',
            },
            routes         : {
                home : 'tab.home',
                login: 'intro'
            },
            theme          : 'positive',
            facebookAppId  : '243372496113928',
            parse          : {
                appId : 'fde3a43c-8f25-44e6-8aa8-3923d78338f1',
                server: 'https://parse.buddy.com/parse/',
            },
            map            : {
                unit: 'mi',
                type: 'normal',
            },
            locales        : [
                {
                    translation: 'portugues',
                    code       : 'pt'
                },
                {
                    translation: 'english',
                    code       : 'en'
                },
                {
                    translation: 'turkish',
                    code       : 'tr'
                },
                {
                    translation: 'persian',
                    code       : 'fa'
                },
                {
                    translation: 'german',
                    code       : 'de'
                }
            ],
            preferredLocale: 'en'
        };
    }
})();

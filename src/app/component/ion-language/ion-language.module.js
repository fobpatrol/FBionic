(function () {
    'use strict';

    var path = 'app/component/ion-language';
    
    angular
        .module('ion-language', [
            'ngCookies',
            'pascalprecht.translate', // angular-translate
            'tmh.dynamicLocale' // angular-dynamic-locale
        ])
        .config(configLanguage);



    function configLanguage($translatePartialLoaderProvider, $translateProvider, AppConfig, tmhDynamicLocaleProvider) {

        // angular-translate configuration
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: '{part}/i18n/{lang}.json'
        });
        $translateProvider.useSanitizeValueStrategy(null);

        // Translate Config
        $translateProvider.useMissingTranslationHandlerLog();
        $translateProvider.useLocalStorage(); // saves selected language to localStorage
        tmhDynamicLocaleProvider.localeLocationPattern('../bower_components/angular-i18n/angular-locale_{{locale}}.js');

        var langvar     = navigator.language || navigator.userlanguage;
        var userlangvar = langvar.split('-')[0];
        var language    = AppConfig.preferredLocale;
        var searchLang  = _.some(AppConfig.locales, {
            code: userlangvar
        });

        if (searchLang) {
            language = AppConfig.locales.filter(function  (item) {
                return language == item.code
            })[0].code;
        }
        $translateProvider.preferredLanguage(language);
        moment.locale(language);

        // Translation
        $translatePartialLoaderProvider.addPart(path);
    }


})();

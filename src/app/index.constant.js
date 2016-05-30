(function () {
    'use strict';
    angular
        .module('ionic')
        .constant('AppConfig', AppConfig());

    function AppConfig() {
        return {
            path: 'app/module/photogram',
            app: {
                name: 'Photogram',
                url: 'http://photogramapp.com',
                image: 'http://photogramapp.com/social-share.jpg',
            },
            routes: {
                home: 'photogram.home',
                login: 'user.intro'
            },
            color: '#00796B',
            facebook: '1024016557617380',
            parse: {
                appId: 'myAppId',
                server: 'https://photogramserver.herokuapp.com/parse/'
            },
            locales: [
                {
                    translation: 'LANG.PORTUGUES',
                    code: 'pt'
                },
                {
                    translation: 'LANG.ENGLISH',
                    code: 'en'
                },
                {
                    translation: 'LANG.TURKISH',
                    code: 'tr'
                },
                {
                    translation: 'LANG.PERSIAN',
                    code: 'fa'
                },
                {
                    translation: 'LANG.GERMAN',
                    code: 'de'
                }
            ],
            preferredLocale: 'en',
            DAO: {
                name: 'photogram_db',
                tables: [
                    {
                        name: 'User',
                        columns: {
                            id: 'TEXT PRIMARY KEY',
                            name: 'TEXT',
                            username: 'TEXT',
                            email: 'TEXT',
                            language: 'TEXT',
                            facebookimg: 'TEXT',
                            gender: 'TEXT',
                            img: 'TEXT',
                            facebook: 'INTEGER',
                            qtdFollow: 'INTEGER',
                            status: 'TEXT',
                            createdAt: 'INTEGER',
                            attributes: 'TEXT'
                        }
                    },
                    {
                        name: 'UserFollow',
                        columns: {
                            id: 'TEXT PRIMARY KEY',
                            user_id: 'TEXT',
                            followId: 'TEXT'
                        },
                    },
                    {
                        name: 'Gallery',
                        columns: {
                            id: 'TEXT PRIMARY KEY',
                            img: 'TEXT',
                            title: 'TEXT',
                            user_id: 'TEXT',
                            location: 'TEXT',
                            qtdLike: 'INTEGER',
                            liked: 'BOOLEAN',
                            likes: 'INTEGER',
                            createdAt: 'INTEGER'
                        }
                    },
                    {
                        name: 'GalleryActivity',
                        columns: {
                            id: 'TEXT PRIMARY KEY',
                            action: 'TEXT',
                            img: 'TEXT',
                            userAvatar: 'TEXT',
                            userName: 'TEXT',
                            user_id: 'TEXT',
                            gallery_id: 'TEXT',
                            createdAt: 'INTEGER'
                        }
                    },
                    {
                        name: 'GalleryComment',
                        columns: {
                            id: 'TEXT PRIMARY KEY',
                            name: 'TEXT',
                            user_id: 'TEXT',
                            userName: 'TEXT',
                            gallery_id: 'TEXT',
                            createdAt: 'INTEGER'
                        }
                    },
                    {
                        name: 'GallerySetting',
                        columns: {
                            key : 'TEXT',
                            value: 'TEXT'
                        }
                    }
                ]
            }
        };
    }
})();
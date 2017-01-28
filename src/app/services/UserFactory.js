(function () {
  'use strict';
  angular.module('starter').factory('User', UserFactory);

  function UserFactory($q, $translate, $window, $cordovaDevice, Parse, ParsePush) {

    var fields = [
      'name',
      'username',
      'status',
      'gender',
      'email',
      'photo',
      'photoThumb',
      'roleName',
    ];

    var ParseObject = Parse.User.extend({}, {
      profile:                profile,
      list:                   list,
      getFollowers:           getFollowers,
      getLikers:              getLikers,
      getFollowing:           getFollowing,
      signIn:                 signIn,
      signUp:                 signUp,
      signInViaFacebook:      signInViaFacebook,
      updateWithFacebookData: updateWithFacebookData,
      logOut:                 logOut,
      findByEmail:            findByEmail,
      getPublicData:          getPublicData,
      recoverPassword:        recoverPassword,
      destroy:                destroy,
      setPhoto:               setPhoto,
      follow:                 follow,
      all:                    all,
      validateUsername:       validateUsername,
      validateEmail:          validateEmail,
      update:                 update,
      fetch:                  fetch,
      facebookSyncProfile:    facebookSyncProfile,

    });

    function fetch() {
      var defer = $q.defer();
      if (Parse.User.current()) {
        Parse.User.current().fetch().then(defer.resolve, defer.reject);
      } else {
        defer.reject();
      }
      return defer.promise;
    }


    function update(params) {
      var user    = Parse.User.current();
      // User Language
      params.lang = $translate.use();

      angular.forEach(params, function (value, key) {
        user.set(key, value);
      });
      return user.save();
    }

    function setPhoto(parseFile) {
      return Parse.User.current().set({'photo': parseFile}).save();
    }

    function recoverPassword(email) {
      return Parse.User.requestPasswordReset(email);
    }

    function getPublicData(user) {
      console.log(user);
      var defer = $q.defer();
      new Parse.Query('UserData').equalTo('user', user).first().then(function (userData) {
        if (userData) {
          defer.resolve(userData);
        } else {
          defer.reject(Parse.Promise.error({
            code:    1,
            message: 'User Data not found'
          }));
        }
      }, defer.reject);
      return defer.promise;
    }


    function logOut() {
      //return Parse.User.logOut();
      console.log(Parse.applicationId);
      delete $window.localStorage['Parse/' + Parse.applicationId + '/currentUser'];
      delete $window.localStorage['Parse/' + Parse.applicationId + '/installationId'];
    }

    function signInViaFacebook(authData) {

      var facebookAuthData = {
        id:              authData.authResponse.userID,
        access_token:    authData.authResponse.accessToken,
        expiration_date: (new Date().getTime() + 1000).toString()
      };
      return Parse.FacebookUtils.logIn(facebookAuthData);
    }

    function signUp(data) {
      return new Parse.User()
        .set({'name': data.name})
        .set({'username': data.username})
        .set({'email': data.email})
        .set({'password': data.password})
        .set({'roleName': 'User'})
        .signUp(null);

    }

    function signIn(obj) {
      var defer = $q.defer();

      Parse.User.logIn(obj.username.toLowerCase(), obj.password, {
        success: function (currentUser) {

          // device
          var updateUser;
          if (window.cordova) {
            updateUser = {
              device:   $cordovaDevice.getDevice(),
              cordova:  $cordovaDevice.getCordova(),
              model:    $cordovaDevice.getModel(),
              platform: $cordovaDevice.getPlatform(),
              uuid:     $cordovaDevice.getUUID(),
              version:  $cordovaDevice.getVersion()
            };
          } else {
            var userAgent = window.navigator.userAgent.match(/(?:Chrom(?:e|ium)|Firefox)\/([0-9]+)\./);

            updateUser = {
              device:   {device: (userAgent) ? userAgent[0] : 'emulator'},
              cordova:  '',
              model:    (userAgent) ? userAgent[0] : 'emulator',
              platform: window.navigator.platform,
              uuid:     '',
              version:  (userAgent) ? userAgent[0] : 'emulator'
            };
          }

          // Save
          updateUser.lang = $translate.use();

          if (window.cordova) {
            // Parse Push
            ParsePush.init();
          }

          Parse.User.update(updateUser).then(function () {
            defer.resolve(currentUser);
          }).catch(defer.reject);
        },
        error:   defer.reject
      });

      return defer.promise;
    }

    function updateWithFacebookData() {
      return Parse.Cloud.run('saveFacebookPicture');
    }

    function facebookSyncProfile(fbData) {
      var currentUser = Parse.User.current();

      if (!currentUser.get('facebook') && fbData.id) {
        currentUser.set('facebook', fbData.id);
      }

      if (!currentUser.get('email') && fbData.email) {
        currentUser.set('email', fbData.email);
      }

      if (!currentUser.get('name') && fbData.name) {
        currentUser.set('name', fbData.name);
      }

      if (!currentUser.get('gender') && fbData.gender) {
        currentUser.set('gender', fbData.gender);
      }

      if (!currentUser.get('birthdate') && fbData.birthday) {
        currentUser.set('birthdate', new Date(fbData.birthday));
      }

      return currentUser.save();
    }

    function destroy(data) {
      return Parse.Cloud.run('destroyUser', data);
    }

    function validateEmail(input) {
      return Parse.Cloud.run('validateEmail', {email: input});
    }

    function validateUsername(input) {
      return Parse.Cloud.run('validateUsername', {username: input});
    }

    function all(params) {
      return Parse.Cloud.run('getUsers', params);
    }

    function follow(userId) {
      return Parse.Cloud.run('followUser', {userId: userId});
    }

    function findByEmail(email) {
      return Parse.Cloud.run('findUserByEmail', {email: email});
    }

    function profile(username) {
      return Parse.Cloud.run('profile', {username: username});
    }

    function list(params) {
      return Parse.Cloud.run('listUsers', params);
    }

    function getFollowers(username) {
      return Parse.Cloud.run('getFollowers', {username: username});
    }

    function getLikers(galleryId) {
      return Parse.Cloud.run('getLikers', {galleryId: galleryId});
    }

    function getFollowing(username) {
      return Parse.Cloud.run('getFollowing', {username: username});
    }


    fields.map(function (field) {
      Object.defineProperty(ParseObject.prototype, field, {
        get: function () {
          return this.get(field);
        },
        set: function (value) {
          this.set(field, value);
        }
      });
    });

    // This is a GeoPoint Object
    Object.defineProperty(ParseObject.prototype, 'location', {
      get: function () {
        return this.get('location');
      },
      set: function (val) {
        this.set('location', new Parse.GeoPoint({
          latitude:  val.latitude,
          longitude: val.longitude
        }));
      }
    });

    return ParseObject;

  }

})();

(function () {
  'use strict';
  angular.module('starter').factory('GalleryFeedback', function ($q, moment) {

    var ParseObject = Parse.Object.extend('GalleryFeedback', {
      getStatus: function () {
        if (this.isApproved) {
          return 'Approved';
        } else if (this.isApproved === false) {
          return 'Rejected';
        } else {
          return 'Pending';
        }
      }
    }, {
      create : function (item) {
        var defer    = $q.defer();
        var objPlace = new ParseObject();
        item.user    = Parse.User.current();
        objPlace.save(item, {
          success: defer.resolve,
          error  : defer.reject
        });

        return defer.promise;
      },
      update : function (item) {
        var defer = $q.defer();
        item.save(null, {
          success: defer.resolve,
          error  : defer.reject
        });
        return defer.promise;
      },
      destroy: function (item) {
        var defer = $q.defer();
        item.destroy({
          success: defer.resolve,
          error  : defer.reject
        });
        return defer.promise;
      },
      all    : function (params) {
        var defer = $q.defer();
        var query = new Parse.Query(this);

        if (params.filter != '') {
          query.contains('words', params.filter);
        }

        if (params.date && params.date !== null) {
          var start = moment(params.date).startOf('day');
          var end   = moment(params.date).endOf('day');
          query.greaterThanOrEqualTo('createdAt', start.toDate());
          query.lessThanOrEqualTo('createdAt', end.toDate());
        }

        if (params.status && params.status !== null) {

          if (params.status === 'pending') {
            query.doesNotExist('isApproved');
          } else if (params.status === 'rejected') {
            query.equalTo('isApproved', false);
          } else if (params.status === 'approved') {
            query.equalTo('isApproved', true);
          }

        }

        query.include('gallery')
        query.include('User')
        query.descending('createdAt');
        query.limit(params.limit);
        query.skip((params.page * params.limit) - params.limit);
        query.find({
          success: defer.resolve,
          error  : defer.reject
        });

        return defer.promise;
      },
      count  : function (params) {
        var defer = $q.defer();
        var query = new Parse.Query(this);

        if (params.filter != '') {
          query.contains('words', params.filter);
        }

        if (params.date && params.date !== null) {
          var start = moment(params.date).startOf('day');
          var end   = moment(params.date).endOf('day');
          query.greaterThanOrEqualTo('createdAt', start.toDate());
          query.lessThanOrEqualTo('createdAt', end.toDate());
        }

        // Order Table
        if (params.order) {
          if (params.order.indexOf('-') < -1) {
            query.ascending(params.order);
          } else {
            query.descending(params.order.replace('-'));
          }
        }

        if (params.status && params.status !== null) {

          if (params.status === 'pending') {
            query.doesNotExist('isApproved');
          } else if (params.status === 'rejected') {
            query.equalTo('isApproved', false);
          } else if (params.status === 'approved') {
            query.equalTo('isApproved', true);
          }
        }

        query.count({
          success: function (count) {
            defer.resolve(count);
          },
          error  : function (error) {
            defer.reject(error);
          }
        });

        return defer.promise;
      }
    });

    Object.defineProperty(ParseObject.prototype, 'user', {
      get: function () {
        return this.get('user');
      },
      set: function (value) {
        this.set('user', value);
      }
    });

    Object.defineProperty(ParseObject.prototype, 'subject', {
      get: function () {
        return this.get('subject');
      },
      set: function (value) {
        this.set('subject', value);
      }
    });

    Object.defineProperty(ParseObject.prototype, 'message', {
      get: function () {
        return this.get('title');
      },
      set: function (value) {
        this.set('title', value);
      }
    });

    Object.defineProperty(ParseObject.prototype, 'hashtags', {
      get: function () {
        return this.get('hashtags');
      },
      set: function (value) {
        this.set('hashtags', value);
      }
    });

    Object.defineProperty(ParseObject.prototype, 'words', {
      get: function () {
        return this.get('words');
      },
      set: function (value) {
        this.set('words', value);
      }
    });


    Object.defineProperty(ParseObject.prototype, 'isApproved', {
      get: function () {
        return this.get('isApproved');
      },
      set: function (value) {
        this.set('isApproved', value);
      }
    });

    Object.defineProperty(ParseObject.prototype, 'expiresAt', {
      get: function () {
        return this.get('expiresAt');
      },
      set: function (value) {
        this.set('expiresAt', value);
      }
    });

    return ParseObject;

  });

})();

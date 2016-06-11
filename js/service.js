angular.module('app.service', ['ngResource'])

.service('translationService', function ($resource) {
    this.getTranslation = function ($rootScope, language) {
      var languageFilePath = 'Resource/i18n/translation_' + language + '.json';
      $resource(languageFilePath).get(function (data) {
        $rootScope.translation = data;

      });
    };
  })
  .service("sqlService", function ($cordovaSQLite) {
  var self= this;
    self.execute = function (query, parameter) {
      if (parameter == null)
        parameter = [];
      return $cordovaSQLite.execute(db, query, parameter);
    };

    self.insert = function (id, day_value) {
      var query = "INSERT INTO abm_values (id, day_value) VALUES (?,?)";
      $cordovaSQLite.execute(db, query, [id, day_value]).then(function (res) {
        console.log("INSERT ID -> " + res.insertId);
      }, function (err) {
        console.error(err);
      });
    };

    self.select = function (id) {
      var query = "SELECT id, day_value FROM abm_values WHERE id = ?";
      return $cordovaSQLite.execute(db, query, [id]);

    };

    self.deleteAll = function () {
      var query = "DELETE FROM abm_values";
      $cordovaSQLite.execute(db, query).then(function (res) {
        console.log("DELETE ALL");
      }, function (err) {
        console.error(err);
      });
    };

    self.delete = function (id) {
      var query = "DELETE FROM abm_values WHERE id = ?";
      $cordovaSQLite.execute(db, query, [id]).then(function (res) {
        console.log("DELETE ALL");
      }, function (err) {
        console.error(err);
      });
    };


    self.update = function (day_value, id) {
      var query = "UPDATE abm_values SET day_value = ? WHERE id = ?";
      $cordovaSQLite.execute(db, query, [day_value, id]).then(function (res) {
        console.log("UPDATE");
      }, function (err) {
        console.error(err);
      });
    };

    self.insertOrUpdate = function (id, day_value) {
      this.select(id).then(function (data) {
        if (data.rows.length > 0) {
           self.update(day_value, id);
        } else {
           self.insert(id, day_value);
        }
      });
    };


  })
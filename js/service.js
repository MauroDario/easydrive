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
  this.execute = function (query, parameter) {
    if (parameter == null)
      parameter = [];
    return $cordovaSQLite.execute(db, query, parameter);
  };
})
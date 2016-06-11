angular.module('app.controllers', ['app.service'])

.controller('homeCtrl', function ($scope, sqlService) {

})

.controller('oilChangeCtrl', function ($scope, sqlService) {

  sqlService.select("oilChangeCtrl").then(function (data) {
    $scope.foo={days:0};
    if (data.rows.length > 0) {
      $scope.foo.days = data.rows.item(0).day_value;
      console.log("se obtuvo " + $scope.foo.days);
    } else {
      console.log("else");
      $scope.foo.days = 15;
    }
  }, function (err) {
    console.log(err);
  });
  $scope.update = function () {
    console.log("updateto: " + $scope.foo.days);
    sqlService.insertOrUpdate("oilChangeCtrl", $scope.foo.days);
  };

})

.controller('oilFilterChangeCtrl', function ($scope) {

})

.controller('airFilterChangeCtrl', function ($scope) {

})

.controller('cabinFilterChangeCtrl', function ($scope) {

})

.controller('plugsChangeCtrl', function ($scope) {

})

.controller('tiresChangeCtrl', function ($scope) {

})

.controller('dampersChangeCtrl', function ($scope) {

})

.controller('carWorkshopReviewCtrl', function ($scope) {

})

.controller('coolantchangeCtrl', function ($scope) {

})

.controller('brakepadschangeCtrl', function ($scope) {

})

.controller('brakefluidchangeCtrl', function ($scope) {

})

.controller('timingbeltchangeCtrl', function ($scope) {

})

.controller('oilFilterChange2Ctrl', function ($scope) {

})
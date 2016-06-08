var db = null;

var myApp = angular.module('starter', ['ionic', 'ngCordova'])
  .run(function ($ionicPlatform, $cordovaSQLite) {
    $ionicPlatform.ready(function () {
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }

      if (window.cordova) {
        db = $cordovaSQLite.openDB({
          name: "my.db",
          
        }); //device
        console.log("Android");
      } else {
        db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser
        console.log("browser");

      }

      //            db = $cordovaSQLite.openDB({
      //                name: 'my.db'
      //            });
      $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS people (id integer primary key, firstname text, lastname text)");
    });
  });

myApp.controller("ExampleController", function ($scope, $cordovaSQLite) {

  $scope.insert = function (firstname, lastname) {
    var query = "INSERT INTO people (firstname, lastname) VALUES (?,?)";
    $cordovaSQLite.execute(db, query, [firstname, lastname]).then(function (res) {
      console.log("INSERT ID -> " + res.insertId);
    }, function (err) {
      console.error(err);
    });
  }

  $scope.select = function (lastname) {
    var query = "SELECT firstname, lastname FROM people WHERE lastname = ?";
    $cordovaSQLite.execute(db, query, [lastname]).then(function (res) {
      if (res.rows.length > 0) {
        $scope.data = res.rows.item(0).firstname;
        console.log("SELECTED -> " + res.rows.item(0).firstname + " " + res.rows.item(0).lastname);
      } else {
        $scope.data = "No results found";
        console.log("No results found");
      }
    }, function (err) {
      console.error(err);
    });
  }

  $scope.delete = function () {
    var query = "DELETE FROM people";
    $cordovaSQLite.execute(db, query).then(function (res) {
      console.log("DELETE ALL");
    }, function (err) {
      console.error(err);
    });
  }


  $scope.update = function (firstname, id) {
    var query = "UPDATE people SET firstname = ? WHERE id = ?";
    $cordovaSQLite.execute(db, query, [firstname, id]).then(function (res) {
      console.log("UPDATE");
    }, function (err) {
      console.error(err);
    });
  }

});
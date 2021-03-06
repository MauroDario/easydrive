var db = null;
var index = 1;

angular.module('app', ['ionic', 'ngCordova', 'app.controllers', 'app.routes', 'app.service', 'app.directives'])

  .run(function ($ionicPlatform, $cordovaSQLite, $rootScope, $interval, $cordovaLocalNotification,$state) {

    $ionicPlatform.ready(function () {

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }

      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      if (window.cordova) {
        db = $cordovaSQLite.openDB({
          name: "my.db",
          location: "default"
        }); //device
        console.log("Android");
      } else {
        db = window.openDatabase("my.db", '1', 'my', 1024 * 1024 * 100); // browser
        console.log("browser");

      }

      var aux = $cordovaLocalNotification;
      // Check if is the first time that use the app
      $cordovaSQLite.execute(db, "SELECT name FROM sqlite_master WHERE type='table' AND name = 'abm_values'").then(
        function (resultSet) {
          console.log(resultSet);
          if (resultSet.rows.length == 1) {
            console.log("EXIST the table");
          }
          else {
            // If not exist the table, redirect to show the introduction modal
            console.log("NOT EXIST the table");
            $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS abm_values (id text primary key, time_value integer, save_date text)");
            $state.go('menu.introduction');
          }
        }, function (err) {
          console.log(err);
        });
      //schedule

      /*    // Android customization
          cordova.plugins.backgroundMode.setDefaults({
            text: 'Doing heavy tasks.'
          });
          // Enable background mode
          cordova.plugins.backgroundMode.enable();
  
          // Called when background mode has been activated
          cordova.plugins.backgroundMode.onactivate = function () {
            var index = 1;*/
      /*    $interval(function ($cordovaLocalNotification) {
            var aux =$cordovaLocalNotification
            $scope.scheduleSingleNotification = function () {
              $cordovaLocalNotification.schedule({
                id: 1,
                title: 'Title here',
                text: 'Text here',
                data: {
                  customProperty: 'custom value'
                }
              }).then(function (result) {
                console.log("schedule - " + index);
                index = index++;
              });
            };
             // Modify the currently displayed notification
              console.log("-setTimeOut-");
              cordova.plugins.backgroundMode.configure({
                silent: true,
                text: 'Running ' + index
              });
              index = index++;
            }, 15000);
          });*/


    });
  })

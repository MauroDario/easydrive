var db = null;

angular.module('app', ['ionic','ngCordova', 'app.controllers', 'app.routes', 'app.service', 'app.directives'])

.run(function ($ionicPlatform,$cordovaSQLite, $rootScope, translationService) {
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
    
    $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS abm_values (id text primary key, day_value integer)");

  });
})
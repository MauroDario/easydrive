angular.module('app.controllers', ['app.service'])

.controller('homeCtrl', function ($scope, $rootScope, translationService, $ionicPopup) {

    // Inicializo Combo de Lenguajes
    $scope.data = {
        ddlLanguage: "es_ES"
    }

    // Defino función de cambio de Lenguaje
    $rootScope.translate = function (language) {
        $rootScope.selectedLanguage = language;
        translationService.getTranslation($rootScope, $rootScope.selectedLanguage);
    };

    // Idioma default Español --> ToDo!
    $rootScope.translate("es_ES");

    // Cambio lenguaje cuando modifico el valor del Combo de Lenguajes
    $scope.changeLanguage = function () {
        $rootScope.translate($scope.data.ddlLanguage);
    }


    $scope.showAlert = function () {
        var alertPopup = $ionicPopup.alert({
            title: 'Don\'t eat that!',
            template: 'It might taste good'
        });

        alertPopup.then(function (res) {
            console.log('Thank you for not eating my delicious ice cream cone');
        });
    };

})

.controller('oilChangeCtrl', function ($scope, sqlService, $cordovaLocalNotification) {

    $scope.$on('$ionicView.enter', function () {
        sqlService.select("oilChange").then(function (data) {
            $scope.foo = {
                days: 1
            };
            if (data.rows.length > 0) {
                $scope.foo.days = data.rows.item(0).day_value;
                console.log("se obtuvo " + $scope.foo.days);
            } else {
                console.log("else");
                $scope.foo.days = 15;
            }
            console.log(data);
        }, function (err) {
            console.log(err);
        });
    })



    $scope.update = function () {
        console.log("updateto: " + $scope.foo.days);
        sqlService.insertOrUpdate("oilChange", 1);
        /*cordova.plugins.notification.local.schedule({
            text: "Delayed Notification",
            at: _5_sec_from_now,
            led: "FF0000",
            sound: null
        });*/
    };
})

.controller('oilFilterChangeCtrl', function ($scope) {

})

.controller('airFilterChangeCtrl', function ($scope, sqlService) {

    // Se inicializa la variable que permite alternan entre pantalla visualización/edición
    $scope.editMode = false;

    // Se carga el valor de días de la base
    sqlService.select("airFilterChangeCtrl").then(function (data) {
        $scope.daysInput = {
            value: 0
        };

        if (data.rows.length > 0) {
            $scope.daysInput.value = data.rows.item(0).day_value;
            console.log("se obtuvo " + $scope.daysInput.value);
        } else {
            console.log("else");
            $scope.daysInput.value = 100;
        }
    }, function (err) {
        console.log(err);
    });

    // Guardar valor de días en la base
    $scope.save = function () {
        sqlService.insertOrUpdate("airFilterChange", $scope.daysInput.value);
    }
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
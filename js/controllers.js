angular.module('app.controllers', ['app.service'])

.controller('homeCtrl', function ($scope, $rootScope, translationService, sqlService, idsSchedule, $ionicPopup) {

    /* LENGUAJE */

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

    /* FIN LENGUAJE */

    /* ABMs */

    // Se inicializa la variable que permite alternan entre pantalla visualización/edición, según si hay valor cargado o no.
    $scope.loadABM = function (id) {
        sqlService.select(id).then(function (data) {
            if (data.rows.length > 0) {
                var reg = data.rows.item(0);

                $scope.firstTime = false;
                $scope.editMode = false;
                $scope.daysInput = {
                    value: reg.day_value
                };

                // Se chequea si está vencido el control
                if (reg.remaining_days < 1)
                    $scope.isOverdue = true;
                else
                    $scope.isOverdue = false;

            } else {
                $scope.firstTime = true;
                $scope.editMode = true;
                $scope.isOverdue = false;
                $scope.daysInput = {
                    value: 100
                };
            }
        });
    }

    // Guardar valor de días en la base
    $scope.save = function (id) {
        $scope.firstTime = false;
        sqlService.insertOrUpdate(id, $scope.daysInput.value);
    };
    
    // Mostrar popup con el valor de los días restantes
    $scope.showRemainingDays = function (id) {
        sqlService.select(id).then(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: $rootScope.translation.showRemainDays,
                template: $rootScope.translation.showRemainDaysMsg + data.rows.item(0).remaining_days
            });
        });
    }

    // Si cancela, el rangeBar se resetea!
    $scope.reset = function (id) {
        sqlService.select(id).then(function (data) {
            $scope.daysInput = {
                value: data.rows.item(0).day_value
            };
        });
    }

    /* FIN ABMs */

})

.controller('oilChangeCtrl', function ($scope, sqlService, $cordovaLocalNotification) {
    $scope.$on('$ionicView.enter', function () {
        sqlService.select("oilChange").then(function (data) {
            $scope.foo = {
                days: 5
            };
            console.log(data);
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
        sqlService.insertOrUpdate("oilChange", $scope.foo.days).then(function (data) {
            localNotificationService.scheduleDays(idsSchedule[id], $rootScope.translation["oilChangeTextNotification"], $scope.foo.days)
        });
        /*cordova.plugins.notification.local.schedule({
            text: "Delayed Notification",
            at: _5_sec_from_now,
            led: "FF0000",
            sound: null
        });*/
    };
})

.controller('oilFilterChangeCtrl', function ($scope) {
    $scope.loadABM("oilFilterChange");
})

.controller('airFilterChangeCtrl', function ($scope) {
    $scope.loadABM("airFilterChange");
})

.controller('cabinFilterChangeCtrl', function ($scope) {
    $scope.loadABM("cabinFilterChange");
})

.controller('plugsChangeCtrl', function ($scope) {
    $scope.loadABM("plugsChange");
})

.controller('tiresChangeCtrl', function ($scope) {
    $scope.loadABM("tiresChange");
})

.controller('dampersChangeCtrl', function ($scope) {
    $scope.loadABM("dampersChange");
})

.controller('carWorkshopReviewCtrl', function ($scope) {
    $scope.loadABM("carWorkshopReview");
})

.controller('coolantchangeCtrl', function ($scope) {
    $scope.loadABM("coolantchange");
})

.controller('brakepadschangeCtrl', function ($scope) {
    $scope.loadABM("brakepadschange");
})

.controller('brakefluidchangeCtrl', function ($scope) {
    $scope.loadABM("brakefluidchange");
})

.controller('timingbeltchangeCtrl', function ($scope) {
    $scope.loadABM("timingbeltchange");
})
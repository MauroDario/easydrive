angular.module('app.controllers', ['app.service'])


.controller('homeCtrl', function ($scope, $rootScope, translationService, sqlService, idsSchedule, $ionicPopup) {

    // Lenguaje start

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

    //close

    // Vencimiento start

    $scope.diccVenc = new Array();
    $scope.dicDiffDays = {};

    sqlService.selectAll().then(function (data) {
        for (i = 0; i < data.rows.length; i++) {
            var reg = data.rows.item(i);

            var save_date = new Date(reg.save_date);
            save_date.setDate(save_date.getDate() + 1);
            var today = new Date();

            var timeDiff = Math.abs(today.getTime() - save_date.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

            $scope.dicDiffDays[reg.id] = diffDays;
            console.log(reg);
            console.log(diffDays);
            if (diffDays >= reg.day_value)
                $scope.diccVenc.push(reg.id);
        }
    });

    $scope.isOverDue = function (id) {
        return $scope.diccVenc.some(elem => elem == id.toUpperCase());
    };

    //close

    // ABM start

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

    //close

})

// ABM Controllers start
.controller('oilChangeCtrl', function ($scope, sqlService, $cordovaLocalNotification, localNotificationService, idsSchedule, $rootScope) {
    $scope.$on('$ionicView.enter', function () {
        sqlService.select("oilChange").then(function (data) {
            $scope.foo = {
                days: 5
            };
            console.log(data);
            if (data.rows.length > 0) {
                $scope.foo.days = data.rows.item(0).day_value;
            } else {

                $scope.foo.days = 15;
            }
            console.log(data);
        }, function (err) {
            console.log(err);
        });
    })

    $scope.update = function () {
        ionic.Platform.ready(function () {
            sqlService.insertOrUpdate("oilChange", $scope.foo.days);
            var date = new Date();
            date = date.setDate(date.getDate() + $scope.foo.days);
            localNotificationService.scheduleDays(idsSchedule["oilChange"], $rootScope.translation["oilChangeTextNotification"], date);
        });
    };

})


.controller('oilFilterChangeCtrl', function ($scope, $rootScope, sqlService, $ionicPopup) {

    // Se inicializa la variable que permite alternan entre pantalla visualización/edición, según si hay valor cargado o no.
    sqlService.select("oilFilterChange").then(function (data) {
        if (data.rows.length > 0) {
            $scope.firstTime = false;
            $scope.editMode = false;
            console.log(data);
            $scope.daysInput = {
                value: data.rows.item(0).day_value
            };
        } else {
            $scope.firstTime = true;
            $scope.editMode = true;
            $scope.daysInput = {
                value: 100
            };
        }
    });

    // Guardar valor de días en la base
    $scope.save = function () {
        sqlService.insertOrUpdate("oilFilterChange", $scope.daysInput.value);
    }

    $scope.showRemainingDays = function () {
        sqlService.select("oilFilterChange").then(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: $rootScope.translation.showRemainDays,
                template: $rootScope.translation.showRemainDaysMsg + data.rows.item(0).remaining_days
            });
        });
    }

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

//
angular.module('app.controllers', ['app.service'])

.controller('homeCtrl', function ($scope, $rootScope, translationService, sqlService, idsSchedule, $ionicPopup, $ionicHistory, DateService, $ionicPlatform, $cordovaSQLite, $state, $ionicModal) {

    // Días previos para dar aviso que falta poco
    $scope.expireSoonDays = 5;

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

    $scope.isOverDue = function (id) {
        return $scope.diccVenc.some(elem => elem == id.toUpperCase());
    };

    $scope.greatThat = function (id) {
        return $scope.dicDiffDays[id] != undefined && $scope.dicDiffDays[id] >= 0;
    };

    //close

    // ABM start

    // Se inicializan todas las variables del ABM
    $scope.loadABM = function (id) {
            sqlService.select(id).then(function (data) {
                if (data.rows.length > 0) {
                    var reg = data.rows.item(0);

                    $scope.firstTime = false;
                    $scope.editMode = false;
                    $scope.timeInput = {
                        value: reg.time_value
                    };

                    $scope.time_type = $scope.castTypeTime(reg.time_value)
                    switch ($scope.time_type) {
                    case 'm':
                        $scope.rangeValues = {
                            max: 24,
                            min: 0,
                            step: 1
                        }
                        //$scope.typeTimeLbl.value = $rootScope.translation["months"];
                        break;

                    case 'y':
                        $scope.rangeValues = {
                            max: 3,
                            min: 0,
                            step: 1
                        }
                        //$scope.typeTimeLbl.value = $rootScope.translation["years"];
                        break;

                    default:
                        $scope.rangeValues = {
                            max: 700,
                            min: 0,
                            step: 50
                        }
                        //$scope.typeTimeLbl.value = $rootScope.translation["days"];
                        break;
                    }

                } else {
                    $scope.firstTime = true;
                    $scope.editMode = true;
                    $scope.isOverdue = false;
                    $scope.timeInput = {
                        value: 0
                    };
                    $scope.rangeValues = {
                        max: 700,
                        min: 0,
                        step: 50
                    }
                    $scope.time_type = 'd';
                    /*$scope.typeTimeLbl = {
                        value: $rootScope.translation["days"]
                    };*/
                }
            });
        }
        /*
        $scope.timeInput = {
            value: 1
        };*/

    // Según el valor de días guardados, transformarlo en meses o años en lo posible.
    $scope.castTypeTime = function (timeValue) {
        if (timeValue == 0) return 0;
        if (timeValue % 365 == 0) return 'y';
        if (timeValue % 30 == 0) return 'm';
        return 'd';
    }

    // Cambiar el tipo del seteo del tiempo (días, meses, años)
    $scope.clicked = function (char) {
        if (char == $scope.time_type) return;

        $scope.timeInput.value = 0;
        $scope.time_type = char;

        switch (char) {
        case 'm':
            $scope.rangeValues = {
                max: 24,
                min: 0,
                step: 1
            }
            //$scope.typeTimeLbl.value = $rootScope.translation["months"];
            break;

        case 'y':
            $scope.rangeValues = {
                max: 3,
                min: 0,
                step: 1
            }
            //$scope.typeTimeLbl.value = $rootScope.translation["years"];
            break;

        default:
            $scope.rangeValues = {
                max: 700,
                min: 0,
                step: 50
            }
            //$scope.typeTimeLbl.value = $rootScope.translation["days"];
            break;
        }
    }

    $scope.changeTypeTime = function () {
        switch ($scope.time_type) {
            case 'm':
                $scope.timeInput.value = $scope.timeInput.value / 30;
                break;
            case 'y':
                $scope.timeInput.value = $scope.timeInput.value / 365;
                break;
        }
    };

    // Guardar valor de días en la base
    $scope.save = function (id) {
        $scope.firstTime = false;

        var dayValue;
        switch ($scope.time_type) {
            case 'm':
                dayValue = $scope.timeInput.value * 30;
                break;
            case 'y':
                dayValue = $scope.timeInput.value * 365;
                break;
            default:
                dayValue = $scope.timeInput.value;
                break;
        }

        sqlService.insertOrUpdate(id, dayValue, $rootScope.translation[id + "TextNotification"]);
    };

    // Mostrar popup con el valor de los días restantes
    $scope.showRemainingDays = function (id) {
        sqlService.select(id).then(function (data) {
            var day = DateService.addDays(data.rows.item(0).save_date, -1);
            var day2 = new Date(data.rows.item(0).save_date);
            var mje = $rootScope.translation.showRemainDaysMsg + $scope.dicDiffDays[id.toUpperCase()] + ". <br> Fecha inicial de conteo: " + day2.getDate() + "/" + (day2.getMonth() + 1) + "/" + day2.getFullYear();
            var alertPopup = $ionicPopup.alert({
                title: $rootScope.translation.showRemainDays,
                template: mje
            });
        });
    }

    // Si cancela, el rangeBar se resetea!
    $scope.reset = function (id) {
        sqlService.select(id).then(function (data) {
            $scope.timeInput = {
                value: data.rows.item(0).time_value
            };
        });
    };
    $scope.counter = 0;

    // Resetear el contador
    $scope.resetCount = function (id) {
        sqlService.updateCounter(id);
    }

    //close

    // Al cambiar de página se actualizan los vectores de fechas.
    $scope.$on('$stateChangeSuccess', function () {
        $ionicPlatform.ready(function () {
            if (db != null) {
                $scope.diccVenc = [];
                $scope.counter = 0;
                sqlService.selectAll().then(function (data) {
                    for (i = 0; i < data.rows.length; i++) {
                        var reg = data.rows.item(i);

                        var save_date = new Date(reg.save_date);
                        save_date.setDate(save_date.getDate() + 1);
                        var today = new Date();

                        var timeDiff = Math.abs(today.getTime() - save_date.getTime());
                        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

                        $scope.dicDiffDays[reg.id] = DateService.diffDates(DateService.addDays(reg.save_date, reg.time_value), today);

                        if (diffDays >= reg.time_value) {
                            //console.log(reg);
                            $scope.diccVenc.push(reg.id);
                            $scope.counter = $scope.counter + 1;
                        }
                    }
                });
            }
        });
    });

    // Manejo de acción back button
    $ionicPlatform.registerBackButtonAction(function (event) {
        if ($state.current.name == "menu.home") {
            navigator.app.exitApp(); //<-- remove this line to disable the exit
        } else {
            navigator.app.backHistory();
        }
    }, 100);

    // Script inject the introduction Modal functionality
    $ionicModal.fromTemplateUrl('templates/introductionModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openIntroductionModal = function () {
        $scope.modal.show();
    };

    $scope.closeIntroductionModal = function () {
        $scope.modal.hide();
    };
})

// Controller the introduction functionality
.controller('introductionCtrl', function ($scope, $ionicModal, $state) {
    $ionicModal.fromTemplateUrl('templates/introductionModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
    });
    $scope.closeIntroductionModal = function () {
        $scope.modal.hide();
        $state.go('menu.home');
    };
})

// ABM Controllers start
.controller('oilChangeCtrl', function ($scope, localNotificationService) {
    $scope.$on('$stateChangeSuccess', function () {
        $scope.loadABM("oilChange");
    });
})

.controller('oilFilterChangeCtrl', function ($scope, $cordovaLocalNotification) {
    $scope.$on('$stateChangeSuccess', function () {
        $scope.loadABM("oilFilterChange");
    });
})

.controller('airFilterChangeCtrl', function ($scope, $cordovaLocalNotification) {
    $scope.$on('$stateChangeSuccess', function () {
        $scope.loadABM("airFilterChange");
    });
})

.controller('cabinFilterChangeCtrl', function ($scope) {
    $scope.$on('$stateChangeSuccess', function () {
        $scope.loadABM("cabinFilterChange");
    });
})

.controller('plugsChangeCtrl', function ($scope) {
    $scope.$on('$stateChangeSuccess', function () {
        $scope.loadABM("plugsChange");
    });
})

.controller('tiresChangeCtrl', function ($scope) {
    $scope.$on('$stateChangeSuccess', function () {
        $scope.loadABM("tiresChange");
    });
})

.controller('dampersChangeCtrl', function ($scope) {
    $scope.$on('$stateChangeSuccess', function () {
        $scope.loadABM("dampersChange");
    });
})

.controller('carWorkshopReviewCtrl', function ($scope) {
    $scope.$on('$stateChangeSuccess', function () {
        $scope.loadABM("carWorkshopReview");
    });
})

.controller('coolantchangeCtrl', function ($scope) {
    $scope.$on('$stateChangeSuccess', function () {
        $scope.loadABM("coolantchange");
    });
})

.controller('brakepadschangeCtrl', function ($scope) {
    $scope.$on('$stateChangeSuccess', function () {
        $scope.loadABM("brakepadschange");
    });
})

.controller('brakefluidchangeCtrl', function ($scope) {
    $scope.$on('$stateChangeSuccess', function () {
        $scope.loadABM("brakefluidchange");
    });
})

.controller('timingbeltchangeCtrl', function ($scope) {
    $scope.$on('$stateChangeSuccess', function () {
        $scope.loadABM("timingbeltchange");
    });
})

//

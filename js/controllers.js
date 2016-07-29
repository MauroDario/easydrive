angular.module('app.controllers', ['app.service'])


.controller('homeCtrl', function ($scope, $rootScope, translationService, sqlService, idsSchedule, $ionicPopup, $ionicHistory, DateService, $ionicPlatform, $cordovaSQLite, $state,ExpireSoonDays) {

    // Días previos para dar aviso que falta poco
    $scope.expireSoonDays = ExpireSoonDays.value;

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

        // Se inicializa la variable que permite alternan entre pantalla visualización/edición, según si hay valor cargado o no.
        $scope.loadABM = function (id) {
            sqlService.select(id).then(function (data) {
                if (data.rows.length > 0) {
                    var reg = data.rows.item(0);

                    $scope.firstTime = false;
                    $scope.editMode = false;
                    $scope.daysInput.value = reg.day_value;


                } else {
                    $scope.firstTime = true;
                    $scope.editMode = true;
                    $scope.isOverdue = false;
                    $scope.daysInput = {
                        value: 0
                    };
                }
            });
        }

        $scope.daysInput = {
            value: 1
        };

        // Guardar valor de días en la base
        $scope.save = function (id) {
            $scope.firstTime = false;
            sqlService.insertOrUpdate(id, $scope.daysInput.value, $rootScope.translation[id + "TextNotification"],$rootScope.translation[id + "TextNotificationXDays"]);
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
                $scope.daysInput = {
                    value: data.rows.item(0).day_value
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

                            $scope.dicDiffDays[reg.id] = DateService.diffDates(DateService.addDays(reg.save_date, reg.day_value), today);

                            if (diffDays >= reg.day_value) {
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

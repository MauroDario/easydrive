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
        sqlService.select("oilChangeCtrl").then(function (data) {
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
    });

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

.controller('oilFilterChangeCtrl', function ($scope, $rootScope, sqlService, $ionicPopup) {

    // Se inicializa la variable que permite alternan entre pantalla visualización/edición, según si hay valor cargado o no.
    sqlService.select("oilFilterChange").then(function (data) {
        if (data.rows.length > 0) {
            $scope.firstTime = false;
            $scope.editMode = false;
            $scope.daysInput = {
                value: data.rows[0].day_value
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
                template: $rootScope.translation.showRemainDaysMsg + data.rows[0].remaining_days
            });
        });
    }
})

.controller('airFilterChangeCtrl', function ($scope, $rootScope, sqlService, $ionicPopup) {
    // Se inicializa la variable que permite alternan entre pantalla visualización/edición, según si hay valor cargado o no.
    sqlService.select("airFilterChange").then(function (data) {
        if (data.rows.length > 0) {
            $scope.editMode = false;
            $scope.daysInput = {
                value: data.rows[0].day_value
            };
        } else {
            $scope.editMode = false;
            $scope.daysInput = {
                value: 100
            };
        }
    });

    // Guardar valor de días en la base
    $scope.save = function () {
        sqlService.insertOrUpdate("airFilterChange", $scope.daysInput.value);
    }

    $scope.showRemainingDays = function () {
        sqlService.select("airFilterChange").then(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: $rootScope.translation.showRemainDays,
                template: $rootScope.translation.showRemainDaysMsg + data.rows[0].remaining_days
            });
        });
    }
})

.controller('cabinFilterChangeCtrl', function ($scope, $rootScope, sqlService, $ionicPopup) {
    // Se inicializa la variable que permite alternan entre pantalla visualización/edición, según si hay valor cargado o no.
    sqlService.select("cabinFilterChange").then(function (data) {
        if (data.rows.length > 0) {
            $scope.firstTime = false;
            $scope.editMode = false;
            $scope.daysInput = {
                value: data.rows[0].day_value
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
        sqlService.insertOrUpdate("cabinFilterChange", $scope.daysInput.value);
    }

    $scope.showRemainingDays = function () {
        sqlService.select("cabinFilterChange").then(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: $rootScope.translation.showRemainDays,
                template: $rootScope.translation.showRemainDaysMsg + data.rows[0].remaining_days
            });
        });
    }
})

.controller('plugsChangeCtrl', function ($scope, $rootScope, sqlService, $ionicPopup) {
    // Se inicializa la variable que permite alternan entre pantalla visualización/edición, según si hay valor cargado o no.
    sqlService.select("plugsChange").then(function (data) {
        if (data.rows.length > 0) {
            $scope.firstTime = false;
            $scope.editMode = false;
            $scope.daysInput = {
                value: data.rows[0].day_value
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
        sqlService.insertOrUpdate("plugsChange", $scope.daysInput.value);
    }

    $scope.showRemainingDays = function () {
        sqlService.select("plugsChange").then(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: $rootScope.translation.showRemainDays,
                template: $rootScope.translation.showRemainDaysMsg + data.rows[0].remaining_days
            });
        });
    }
})

.controller('tiresChangeCtrl', function ($scope, $rootScope, sqlService, $ionicPopup) {
    // Se inicializa la variable que permite alternan entre pantalla visualización/edición, según si hay valor cargado o no.
    sqlService.select("tiresChange").then(function (data) {
        if (data.rows.length > 0) {
            $scope.firstTime = false;
            $scope.editMode = false;
            $scope.daysInput = {
                value: data.rows[0].day_value
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
        sqlService.insertOrUpdate("tiresChange", $scope.daysInput.value);
    }

    $scope.showRemainingDays = function () {
        sqlService.select("tiresChange").then(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: $rootScope.translation.showRemainDays,
                template: $rootScope.translation.showRemainDaysMsg + data.rows[0].remaining_days
            });
        });
    }
})

.controller('dampersChangeCtrl', function ($scope, $rootScope, sqlService, $ionicPopup) {
    // Se inicializa la variable que permite alternan entre pantalla visualización/edición, según si hay valor cargado o no.
    sqlService.select("dampersChange").then(function (data) {
        if (data.rows.length > 0) {
            $scope.firstTime = false;
            $scope.editMode = false;
            $scope.daysInput = {
                value: data.rows[0].day_value
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
        sqlService.insertOrUpdate("dampersChange", $scope.daysInput.value);
    }

    $scope.showRemainingDays = function () {
        sqlService.select("dampersChange").then(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: $rootScope.translation.showRemainDays,
                template: $rootScope.translation.showRemainDaysMsg + data.rows[0].remaining_days
            });
        });
    }
})

.controller('carWorkshopReviewCtrl', function ($scope, $rootScope, sqlService, $ionicPopup) {
    // Se inicializa la variable que permite alternan entre pantalla visualización/edición, según si hay valor cargado o no.
    sqlService.select("carWorkshopReview").then(function (data) {
        if (data.rows.length > 0) {
            $scope.firstTime = false;
            $scope.editMode = false;
            $scope.daysInput = {
                value: data.rows[0].day_value
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
        sqlService.insertOrUpdate("carWorkshopReview", $scope.daysInput.value);
    }

    $scope.showRemainingDays = function () {
        sqlService.select("carWorkshopReview").then(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: $rootScope.translation.showRemainDays,
                template: $rootScope.translation.showRemainDaysMsg + data.rows[0].remaining_days
            });
        });
    }
})

.controller('coolantchangeCtrl', function ($scope, $rootScope, sqlService, $ionicPopup) {
    // Se inicializa la variable que permite alternan entre pantalla visualización/edición, según si hay valor cargado o no.
    sqlService.select("coolantchange").then(function (data) {
        if (data.rows.length > 0) {
            $scope.firstTime = false;
            $scope.editMode = false;
            $scope.daysInput = {
                value: data.rows[0].day_value
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
        sqlService.insertOrUpdate("coolantchange", $scope.daysInput.value);
    }

    $scope.showRemainingDays = function () {
        sqlService.select("coolantchange").then(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: $rootScope.translation.showRemainDays,
                template: $rootScope.translation.showRemainDaysMsg + data.rows[0].remaining_days
            });
        });
    }
})

.controller('brakepadschangeCtrl', function ($scope, $rootScope, sqlService, $ionicPopup) {
    // Se inicializa la variable que permite alternan entre pantalla visualización/edición, según si hay valor cargado o no.
    sqlService.select("brakepadschange").then(function (data) {
        if (data.rows.length > 0) {
            $scope.firstTime = false;
            $scope.editMode = false;
            $scope.daysInput = {
                value: data.rows[0].day_value
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
        sqlService.insertOrUpdate("brakepadschange", $scope.daysInput.value);
    }

    $scope.showRemainingDays = function () {
        sqlService.select("brakepadschange").then(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: $rootScope.translation.showRemainDays,
                template: $rootScope.translation.showRemainDaysMsg + data.rows[0].remaining_days
            });
        });
    }
})

.controller('brakefluidchangeCtrl', function ($scope, $rootScope, sqlService, $ionicPopup) {
    // Se inicializa la variable que permite alternan entre pantalla visualización/edición, según si hay valor cargado o no.
    sqlService.select("brakefluidchange").then(function (data) {
        if (data.rows.length > 0) {
            $scope.firstTime = false;
            $scope.editMode = false;
            $scope.daysInput = {
                value: data.rows[0].day_value
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
        sqlService.insertOrUpdate("brakefluidchange", $scope.daysInput.value);
    }

    $scope.showRemainingDays = function () {
        sqlService.select("brakefluidchange").then(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: $rootScope.translation.showRemainDays,
                template: $rootScope.translation.showRemainDaysMsg + data.rows[0].remaining_days
            });
        });
    }
})

.controller('timingbeltchangeCtrl', function ($scope, $rootScope, sqlService, $ionicPopup) {
    // Se inicializa la variable que permite alternan entre pantalla visualización/edición, según si hay valor cargado o no.
    sqlService.select("timingbeltchange").then(function (data) {
        if (data.rows.length > 0) {
            $scope.firstTime = false;
            $scope.editMode = false;
            $scope.daysInput = {
                value: data.rows[0].day_value
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
        sqlService.insertOrUpdate("timingbeltchange", $scope.daysInput.value);
    }

    $scope.showRemainingDays = function () {
        sqlService.select("timingbeltchange").then(function (data) {
            var alertPopup = $ionicPopup.alert({
                title: $rootScope.translation.showRemainDays,
                template: $rootScope.translation.showRemainDaysMsg + data.rows[0].remaining_days
            });
        });
    }
})
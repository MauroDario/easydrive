angular.module('app.service', ['ionic', 'ngResource', 'ngCordova'])

.filter('modulo', function () {
    return function (number) {

        if (isNaN(number)) {
            return number;
        } else {
            if (number < 0)
                return number * (-1);
            else return number;
        }
    }
})

//definir los ids cuando se esten creando los abms
.constant('idsSchedule', {
    "OilChange": 1,
    "OilFilterChange": 2,
    "AirFilterChange": 3,
    "cabinFilterChange": 4,
    "PlugsChange": 5,
    "TiresChange": 6,
    "DampersChange": 7,
    "CarWorkshopReview": 8,
    "Coolantchange": 9,
    "brakepadschange": 10,
    "brakefluidchange": 11,
    "Timingbeltchange": 12
})

.constant('idsScheduleXDays', {
    "OilChange": 36,
    "OilFilterChange": 37,
    "AirFilterChange": 38,
    "cabinFilterChange": 39,
    "PlugsChange": 40,
    "TiresChange": 41,
    "DampersChange": 42,
    "CarWorkshopReview": 43,
    "Coolantchange": 44,
    "brakepadschange": 45,
    "brakefluidchange": 46,
    "Timingbeltchange": 47
})

.constant('ExpireSoonDays', {
    value: 5
})

.service('DateService', function () {
    this.diffDates = function (firstDate, secondDate) {
        var utc1 = moment(firstDate);
        var utc2 = moment(secondDate);
        return utc1.diff(utc2, 'days');
    };

    this.addDays = function (date, days) {
        var aux = moment(date);
        aux.add(days, 'days')
        return aux.toDate();
    }
})

.service('translationService', function ($resource) {
    this.getTranslation = function ($rootScope, language) {
        var languageFilePath = 'Resource/i18n/translation_' + language + '.json';
        $resource(languageFilePath).get(function (data) {
            $rootScope.translation = data;
        });
    };
})

.service("sqlService", function ($cordovaSQLite, $ionicPopup, $rootScope, translationService, localNotificationService, idsSchedule, $ionicHistory, $state, DateService,idsScheduleXDays,ExpireSoonDays) {
    var self = this;

    self.execute = function (query, parameter) {
        if (parameter == null)
            parameter = [];
        return $cordovaSQLite.execute(db, query, parameter);
    };

    self.insert = function (id, day_value, text,textXDays) {
        id = id.toUpperCase();
        var query = "INSERT INTO abm_values (id, day_value, save_date) VALUES (?,?,?)";
        var today = moment().format('YYYY-MM-DD');
        //console.log("today: JSON "+today);
        $cordovaSQLite.execute(db, query, [id, day_value, today]).then(function (res) {
                var alertPopup = $ionicPopup.alert({
                    title: $rootScope.translation.successSave,
                    template: $rootScope.translation.successSaveMsg
                });

                alertPopup.then(function (res) {
                    $state.reload();
                });
            },
            function (err) {
                console.error(err);
                var alertPopup = $ionicPopup.alert({
                    title: $rootScope.translation.errorSave,
                    template: $rootScope.translation.errorSaveMsg
                });

                alertPopup.then(function (res) {
                    $state.reload();
                });

            });
        var fechaDeNotificacion= DateService.addDays(new Date(), day_value);
        localNotificationService.scheduleDate(idsSchedule[id], text, fechaDeNotificacion,text );
        localNotificationService.scheduleDate(idsScheduleXDays[id], textXDays, DateService.addDays(fechaDeNotificacion, (-1)*ExpireSoonDays.value));
        
    };

    self.selectAll = function () {
        var query = "SELECT * FROM abm_values";
        return $cordovaSQLite.execute(db, query, []);
    }

    self.select = function (id) {
        var query = "SELECT * FROM abm_values WHERE UPPER(id) = UPPER(?)";
        return $cordovaSQLite.execute(db, query, [id]);
    };

    self.deleteAll = function () {
        var query = "DELETE FROM abm_values";
        $cordovaSQLite.execute(db, query).then(function (res) {}, function (err) {
            console.error(err);
        });
    };

    self.delete = function (id) {
        var query = "DELETE FROM abm_values WHERE UPPER(id) = UPPER(?)";
        $cordovaSQLite.execute(db, query, [id]).then(function (res) {
            console.log("DELETE ALL");
        }, function (err) {
            console.error(err);
        });
    };

    self.updateCounter = function (id) {
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.translation.askToRebootCount,
            template: $rootScope.translation.askToRebootCountMsg,
            cancelText: $rootScope.translation.no,
            okText: $rootScope.translation.yes
        });

        confirmPopup.then(function (res) {
            if (res) {
                // Se desea reiniciar el contador
                var query = "UPDATE abm_values SET save_date = ? WHERE UPPER(id) = UPPER(?)";
                var today = moment().format('YYYY-MM-DD');
                $cordovaSQLite.execute(db, query, [today, id]).then(function (res) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.successSave,
                        template: $rootScope.translation.successSaveMsg
                    });

                    alertPopup.then(function (res) {
                        $state.reload();
                    });
                }, function (err) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.errorSave,
                        template: $rootScope.translation.errorSaveMsg
                    });

                    alertPopup.then(function (res) {
                        $state.reload();
                    });
                })
            }
        });
    }

    self.update = function (day_value, id, text,textXDays) {
        // Se pregunta si el usuario desea reiniciar el contador de días
        var confirmPopup = $ionicPopup.confirm({
            title: $rootScope.translation.askToRebootCount,
            template: $rootScope.translation.askToRebootCountMsg,
            cancelText: $rootScope.translation.no,
            okText: $rootScope.translation.yes
        });

        confirmPopup.then(function (res) {
            if (res) {
                // Se desea reiniciar el contador
                var query = "UPDATE abm_values SET day_value = ?, save_date = ? WHERE UPPER(id) = UPPER(?)";
                var today = moment().format('YYYY-MM-DD');
                $cordovaSQLite.execute(db, query, [day_value, today, id]).then(function (res) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.successSave,
                        template: $rootScope.translation.successSaveMsg
                    });

                    alertPopup.then(function (res) {
                        $state.reload();
                    });

                }, function (err) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.errorSave,
                        template: $rootScope.translation.errorSaveMsg
                    });

                    alertPopup.then(function (res) {
                        $state.reload();
                    });
                });
            } else {
                // No se desea reiniciar el contador
                var query = "UPDATE abm_values SET day_value = ? WHERE UPPER(id) = UPPER(?)";
                $cordovaSQLite.execute(db, query, [day_value, id]).then(function (res) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.successSave,
                        template: $rootScope.translation.successSaveMsg
                    });

                    alertPopup.then(function (res) {
                        $state.reload();
                    });
                }, function (err) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.errorSave,
                        template: $rootScope.translation.errorSaveMsg
                    });

                    alertPopup.then(function (res) {
                        $state.reload();
                    });
                });
            }
            //Notificacion
            var fechaDeNotificacion= DateService.addDays(new Date(), day_value);
            localNotificationService.scheduleDate(idsSchedule[id], text, fechaDeNotificacion);
            localNotificationService.scheduleDate(idsScheduleXDays[id], textXDays, DateService.addDays(fechaDeNotificacion, (-1)*ExpireSoonDays.value));
        });

    };

    //Tambien se crea el schedule para ese dia
    self.insertOrUpdate = function (id, day_value, text,textXDays) {
        this.select(id).then(function (data) {
            if (data.rows.length > 0) {
                return self.update(day_value, id, text,textXDays);
            } else {
                return self.insert(id, day_value, text,textXDays);
            }
        });
    };
})

.service("localNotificationService", function ($ionicPlatform, $cordovaLocalNotification) {
    this.scheduleDate = function (idForSchedule, text, date) {
        cordova.plugins.notification.local.isPresent(idForSchedule, function (present) {
            if (present) {
                cordova.plugins.notification.local.update({
                    id: idForSchedule,
                    text: text,
                    at: date
                });
            } else {
                $ionicPlatform.ready(function () {
                    cordova.plugins.notification.local.schedule({
                        id: idForSchedule,
                        text: text,
                        at: date
                    });
                });
            }
        });        
    };
});

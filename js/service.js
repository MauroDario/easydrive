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

.service('DateService', function () {
    this.diffDates = function (firstDate, secondDate) {
        var _MS_PER_DAY = 1000 * 60 * 60 * 24;
        var utc1 = new Date(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
        var utc2 = new Date(secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate());
        return Math.floor((utc1 - utc2) / _MS_PER_DAY);
    };

    this.addDays = function (date, days) {
        var aux = new Date(date);
        aux.setDate(aux.getDate() + days);
        return aux;
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

.service("sqlService", function ($cordovaSQLite, $ionicPopup, $rootScope, translationService, localNotificationService, idsSchedule, $ionicHistory, $state, DateService) {
    var self = this;

    self.execute = function (query, parameter) {
        if (parameter == null)
            parameter = [];
        return $cordovaSQLite.execute(db, query, parameter);
    };

    self.insert = function (id, day_value,text) {
        id = id.toUpperCase();
        var query = "INSERT INTO abm_values (id, day_value, save_date) VALUES (?,?,?)";
        var today = new Date().toJSON().slice(0, 10);
        $cordovaSQLite.execute(db, query, [id, day_value, today]).then(function (res) {
                var alertPopup = $ionicPopup.alert({
                    title: $rootScope.translation.successSave,
                    template: $rootScope.translation.successSaveMsg
                });

                alertPopup.then(function (res) {
                    $ionicHistory.clearCache().then(function () {
                        $state.reload();
                    });
                });
            },
            function (err) {
                console.error(err);
                var alertPopup = $ionicPopup.alert({
                    title: $rootScope.translation.errorSave,
                    template: $rootScope.translation.errorSaveMsg
                });

                alertPopup.then(function (res) {
                    $ionicHistory.clearCache().then(function () {
                        $state.reload();
                    });
                });

            });
        localNotificationService.scheduleDate(idsSchedule[id], text, DateService.addDays(today, day_value));
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
                var today = new Date().toJSON().slice(0, 10);
                $cordovaSQLite.execute(db, query, [today, id]).then(function (res) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.successSave,
                        template: $rootScope.translation.successSaveMsg
                    });

                    alertPopup.then(function (res) {
                        $ionicHistory.clearCache().then(function () {
                            $state.reload();
                        });
                    });
                }, function (err) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.errorSave,
                        template: $rootScope.translation.errorSaveMsg
                    });

                    alertPopup.then(function (res) {
                        $ionicHistory.clearCache().then(function () {
                            $state.reload();
                        });
                    });
                })
            }
        });
    }

    self.update = function (day_value, id, text) {
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
                var today = new Date().toJSON().slice(0, 10);
                $cordovaSQLite.execute(db, query, [day_value, today, id]).then(function (res) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.successSave,
                        template: $rootScope.translation.successSaveMsg
                    });

                    alertPopup.then(function (res) {
                        $ionicHistory.clearCache().then(function () {
                            $state.reload();
                        });
                    });

                }, function (err) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.errorSave,
                        template: $rootScope.translation.errorSaveMsg
                    });

                    alertPopup.then(function (res) {
                        $ionicHistory.clearCache().then(function () {
                            $state.reload();
                        });
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
                        $ionicHistory.clearCache().then(function () {
                            $state.reload();
                        });
                    });
                }, function (err) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.errorSave,
                        template: $rootScope.translation.errorSaveMsg
                    });

                    alertPopup.then(function (res) {
                        $ionicHistory.clearCache().then(function () {
                            $state.reload();
                        });
                    });
                });
            }
            //Notificacion
            localNotificationService.scheduleDate(idsSchedule[id], text, DateService.addDays(today, day_value));
        });

    };

    //Tambien se crea el schedule para ese dia
    self.insertOrUpdate = function (id, day_value,text) {        
        this.select(id).then(function (data) {
            if (data.rows.length > 0) {
                return self.update(day_value, id,text);
            } else {
                return self.insert(id, day_value,text);
            }
        });
    };
})

.service("localNotificationService", function ($ionicPlatform, $cordovaLocalNotification) {
    this.scheduleDate = function (idForSchedule, text, date) {
        /*console.log("idforschedule: "+ idForSchedule);
        console.log("text: "+ text);
        console.log("date: "+ date);*/
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
                    })
                });
            }
        });
    };
});

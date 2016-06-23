angular.module('app.service', ['ionic', 'ngResource', 'ngCordova'])

//definir los ids cuando se esten creando los abms
.constant('idsSchedule', {
    "oilChange": 1,
    "b": 2
})

.service('translationService', function ($resource) {
    this.getTranslation = function ($rootScope, language) {
        var languageFilePath = 'Resource/i18n/translation_' + language + '.json';
        $resource(languageFilePath).get(function (data) {
            $rootScope.translation = data;

        });
    };
})

.service("sqlService", function ($cordovaSQLite, $ionicPopup, $rootScope, translationService, localNotificationService, idsSchedule, $ionicHistory, $state) {
    var self = this;

    self.execute = function (query, parameter) {
        if (parameter == null)
            parameter = [];
        return $cordovaSQLite.execute(db, query, parameter);
    };

    self.insert = function (id, day_value) {
        id = id.toUpperCase();
        var query = "INSERT INTO abm_values (id, day_value, remaining_days) VALUES (?,?,?)";
        $cordovaSQLite.execute(db, query, [id, day_value, day_value]).then(function (res) {
                console.log("INSERT ID -> " + res.insertId);

                var alertPopup = $ionicPopup.alert({
                    title: $rootScope.translation.successSave,
                    template: $rootScope.translation.successSaveMsg
                });

                alertPopup.then(function (res) {
                    $ionicHistory.clearCache([$state.current.name]).then(function () {
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
                    $ionicHistory.clearCache([$state.current.name]).then(function () {
                        $state.reload();
                    });
                });

            });
    };

    self.select = function (id) {
        var query = "SELECT id, day_value, remaining_days FROM abm_values WHERE UPPER(id) = UPPER(?)";
        return $cordovaSQLite.execute(db, query, [id]);
    };

    self.deleteAll = function () {
        var query = "DELETE FROM abm_values";
        $cordovaSQLite.execute(db, query).then(function (res) {
            console.log("DELETE ALL");
        }, function (err) {
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

    self.update = function (day_value, id) {
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
                var query = "UPDATE abm_values SET day_value = ?, remaining_days = ? WHERE UPPER(id) = UPPER(?)";
                $cordovaSQLite.execute(db, query, [day_value, day_value, id]).then(function (res) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.successSave,
                        template: $rootScope.translation.successSaveMsg
                    });

                    alertPopup.then(function (res) {
                        $ionicHistory.clearCache([$state.current.name]).then(function () {
                            $state.reload();
                        });
                    });

                }, function (err) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.errorSave,
                        template: $rootScope.translation.errorSaveMsg
                    });

                    alertPopup.then(function (res) {
                        $ionicHistory.clearCache([$state.current.name]).then(function () {
                            $state.reload();
                        });
                    });
                })
            } else {
                // No se desea reiniciar el contador
                var query = "UPDATE abm_values SET day_value = ? WHERE UPPER(id) = UPPER(?)";
                $cordovaSQLite.execute(db, query, [day_value, id]).then(function (res) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.successSave,
                        template: $rootScope.translation.successSaveMsg
                    });

                    alertPopup.then(function (res) {
                        $ionicHistory.clearCache([$state.current.name]).then(function () {
                            $state.reload();
                        });
                    });
                }, function (err) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.errorSave,
                        template: $rootScope.translation.errorSaveMsg
                    });

                    alertPopup.then(function (res) {
                        $ionicHistory.clearCache([$state.current.name]).then(function () {
                            $state.reload();
                        });
                    });
                });
            }
        });

    };

    //Tambien se crea el schedule para ese dia
    self.insertOrUpdate = function (id, day_value) {
        this.select(id).then(function (data) {
            if (data.rows.length > 0) {
                return self.update(day_value, id);
            } else {
                return self.insert(id, day_value);
            }

        });
    };
})

.service("localNotificationService", function () {
    this.scheduleDays = function (idForSchedule, text, date) {
        cordova.plugins.notification.local.isPresent(idForSchedule, function (present) {
            if (present) {
                cordova.plugins.notification.local.update({
                    id: idForSchedule,
                    text: text,
                    at: days
                });
            } else {
                cordova.plugins.notification.local.schedule({
                    id: idForSchedule,
                    text: text,
                    at: date
                });
            }
        });
        cordova.plugins.notification.local.update
    };

    this.scheduleDate = function (idForSchedule, text, date) {
        cordova.plugins.notification.local.schedule({
            id: idForSchedule,
            text: text,
            at: date
        });
    };
});
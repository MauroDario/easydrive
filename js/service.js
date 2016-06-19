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

.service("sqlService", function ($cordovaSQLite, $ionicPopup, $rootScope, translationService, localNotificationService, idsSchedule) {
    var self = this;
    
    self.execute = function (query, parameter) {
        if (parameter == null)
            parameter = [];
        return $cordovaSQLite.execute(db, query, parameter);
    };

    self.insert = function (id, day_value) {
        var query = "INSERT INTO abm_values (id, day_value, remaining_days) VALUES (?,?,?)";
        $cordovaSQLite.execute(db, query, [id, day_value, day_value]).then(function (res) {
            console.log("INSERT ID -> " + res.insertId);

            var alertPopup = $ionicPopup.alert({
                title: $rootScope.translation.successSave,
                template: $rootScope.translation.successSaveMsg
            });

            alertPopup.then(function (res) {
                // ToDo!
            });

        }, function (err) {
            console.error(err);

            var alertPopup = $ionicPopup.alert({
                title: $rootScope.translation.errorSave,
                template: $rootScope.translation.errorSaveMsg
            });

            alertPopup.then(function (res) {
                // ToDo!
            });

        });
    };

    self.select = function (id) {
        var query = "SELECT id, day_value, remaining_days FROM abm_values WHERE id = ?";
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
        var query = "DELETE FROM abm_values WHERE id = ?";
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
                var query = "UPDATE abm_values SET day_value = ?, remaining_days = ? WHERE id = ?";
                $cordovaSQLite.execute(db, query, [day_value, day_value, id]).then(function (res) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.successSave,
                        template: $rootScope.translation.successSaveMsg
                    });

                    alertPopup.then(function (res) {
                        // To Do
                    });

                }, function (err) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.errorSave,
                        template: $rootScope.translation.errorSaveMsg
                    });

                    alertPopup.then(function (res) {
                        // ToDo!
                    });
                })
            } else {
                // No se desea reiniciar el contador
                var query = "UPDATE abm_values SET day_value = ? WHERE id = ?";
                $cordovaSQLite.execute(db, query, [day_value, id]).then(function (res) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.successSave,
                        template: $rootScope.translation.successSaveMsg
                    });

                    alertPopup.then(function (res) {
                        // To Do
                    });
                }, function (err) {
                    var alertPopup = $ionicPopup.alert({
                        title: $rootScope.translation.errorSave,
                        template: $rootScope.translation.errorSaveMsg
                    });

                    alertPopup.then(function (res) {
                        // ToDo!
                    });
                });
            }
        });

    };

    //Tambien se crea el schedule para ese dia
    self.insertOrUpdate = function (id, day_value) {
        this.select(id).then(function (data) {
            if (data.rows.length > 0) {
                self.update(day_value, id);
            } else {
                self.insert(id, day_value);
            }
            console.log("antes de notificar " + id);
            localNotificationService.scheduleDays(idsSchedule[id], $rootScope.translation[id + "TextNotification"], day_value)
        });
    };
})

//revisar el titulo solo esta seteando en contenido
.service("localNotificationService", function () {
    this.scheduleDays = function (idForSchedule, text, days) {
        console.log("days: " + days);
        console.log("text: " + text);
        console.log("id: " + idForSchedule);
        cordova.plugins.notification.local.schedule({
            id: idForSchedule,
            text: text,
            every: "minute",
            firstAt: days
        });
    };

    this.scheduleDate = function (idForSchedule, text, date) {
        cordova.plugins.notification.local.schedule({
            id: idForSchedule,
            text: text,
            at: date

        });
    };
});

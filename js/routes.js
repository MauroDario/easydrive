angular.module('app.routes', [])

.config(function ($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



  .state('home', {
    url: '/page1',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  })

  .state('menu.oilChange', {
    url: '/OilChange',
    views: {
      'side-menu21': {
        templateUrl: 'templates/oilChange.html',
        controller: 'oilChangeCtrl'
      }
    }
  })

  .state('menu.oilFilterChange', {
    url: '/OilFilterChange',
    views: {
      'side-menu21': {
        templateUrl: 'templates/oilFilterChange.html',
        controller: 'oilFilterChangeCtrl'
      }
    }
  })

  .state('menu.airFilterChange', {
    url: '/AirFilterChange',
    views: {
      'side-menu21': {
        templateUrl: 'templates/airFilterChange.html',
        controller: 'airFilterChangeCtrl'
      }
    }
  })

  .state('menu.cabinFilterChange', {
    url: '/CabinFilterChange',
    views: {
      'side-menu21': {
        templateUrl: 'templates/cabinFilterChange.html',
        controller: 'cabinFilterChangeCtrl'
      }
    }
  })

  .state('menu.plugsChange', {
    url: '/PlugsChange',
    views: {
      'side-menu21': {
        templateUrl: 'templates/plugsChange.html',
        controller: 'plugsChangeCtrl'
      }
    }
  })

  .state('menu.tiresChange', {
    url: '/TiresChange',
    views: {
      'side-menu21': {
        templateUrl: 'templates/tiresChange.html',
        controller: 'tiresChangeCtrl'
      }
    }
  })

  .state('menu.dampersChange', {
    url: '/DampersChange',
    views: {
      'side-menu21': {
        templateUrl: 'templates/dampersChange.html',
        controller: 'dampersChangeCtrl'
      }
    }
  })

  .state('menu.carWorkshopReview', {
    url: '/CarWorkshopReview',
    views: {
      'side-menu21': {
        templateUrl: 'templates/carWorkshopReview.html',
        controller: 'carWorkshopReviewCtrl'
      }
    }
  })

  .state('menu.coolantchange', {
    url: '/Coolantchange',
    views: {
      'side-menu21': {
        templateUrl: 'templates/coolantchange.html',
        controller: 'coolantchangeCtrl'
      }
    }
  })

  .state('menu.brakepadschange', {
    url: '/Brakepadschange',
    views: {
      'side-menu21': {
        templateUrl: 'templates/brakepadschange.html',
        controller: 'brakepadschangeCtrl'
      }
    }
  })

  .state('menu.brakefluidchange', {
    url: '/Brakefluidchange',
    views: {
      'side-menu21': {
        templateUrl: 'templates/brakefluidchange.html',
        controller: 'brakefluidchangeCtrl'
      }
    }
  })

  .state('timingbeltchange', {
    url: '/Timingbeltchange',
    templateUrl: 'templates/timingbeltchange.html',
    controller: 'timingbeltchangeCtrl'
  })

  .state('menu', {
    url: '/side-menu21',
    templateUrl: 'templates/menu.html',
    abstract: true
  })

  $urlRouterProvider.otherwise('/page1')



});
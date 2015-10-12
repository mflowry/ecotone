var app = angular.module('ecotoneApp', ['ngRoute', 'ngMaterial', 'ngMessages']);

app.config(['$mdThemingProvider', '$routeProvider', '$locationProvider', '$httpProvider', function($mdThemingProvider, $routeProvider, $locationProvider, $httpProvider){
    $locationProvider.html5Mode(true);

    //set theme and color palette
    $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('blue')
        .warnPalette ('orange');

    //routes for views
    $routeProvider.when('/',
        {
            templateUrl: '/views/calculator.html',
        }).when('/login',
        {
            templateUrl: '/views/login.html',
            controller: ''
        }).when('/register',
        {
            templateUrl: '/views/register.html',
            controller: 'createAccountCtrl'
        }).when('/account',
        {
            templateUrl: '/views/account.html',
            controller: ''
        }).when('/dashboard',
        {
            templateUrl: '/views/dashboard.html',
            controller: 'projectsCtrl'
        }).when('/projects',
        {
            templateUrl: '/views/project.html',
            controller: 'projectsCtrl'
        }).when('/about',
        {
            templateUrl: '/views/about.html'
        }).when('/contact',
        {
            templateUrl: '/views/contact.html',
            controller: ''
        }).when('/privacy',
        {
            templateUrl: '/views/privacy.html'
        }).otherwise({
            redirectTo: '/'
        });

    //$httpProvider.interceptors.push('authInterceptor');
}]);


/**
*   CALCULATOR
**/

app.controller('calcCtrl', ['$timeout', '$q', '$log', '$http', '$scope', function($timeout, $q, $log, $http, $scope) {
  loadCategories();
  var self = this;

  // init
  $scope.secondaries = '';
  $scope.secondary_selected = '';
  $scope.secondary_proxy_id = '';
  $scope.calculation = '';
  $scope.weight = '';
  self.response;
  self.materials = [{value: '', display: ''}]

  self.querySearch   = querySearch;
  self.selectedItemChange = selectedItemChange;
  self.searchTextChange   = searchTextChange;

  function querySearch (query) {
    var results = query ? self.materials.filter(     createFilterFor(query) ) : self.materials,
        deferred;

    return results;
  }

  function searchTextChange(text) {
    $log.info('Text changed to ' + text);
    if( text == ''){
      $scope.secondaries = '';
    }
  }

  function selectedItemChange(item) {
    var secondaries = self.response[self.materials.indexOf(item)].secondaries;
    if(secondaries != undefined ){

        $scope.secondaries = secondaries;
        if( $scope.secondaries[0].secondary_cat == null ){
            console.log('null');
            console.log($scope.secondaries[0].warm_id);
            $scope.secondary_selected = $scope.secondaries[0]
            $scope.secondaries = false;
        }

    }
  }

  /**o
   * Build `materials` list of key/value pairs
   */


  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);

    return function filterFn(material) {
      return (material.value.indexOf(lowercaseQuery) != -1);
    };

  }

  function loadCategories() {
      $http.get('/materials').then(function(response) {
          var materials = [];
          self.response = response.data;
          response.data.forEach(function( item ){
              materials.push( item.primary_cat.toLowerCase() )
          });

          self.materials = loadAll( materials );

      });
  };

  function loadAll( array ) {
    var allMaterials = array
    return allMaterials.map( function (material) {
      return {
        value: material.toLowerCase(),
        display: material.charAt(0).toUpperCase() + material.slice(1)
      };
    });
  }

  $scope.newCalculation = function(){
     $http.post('/calculations', {proxyID: $scope.secondary_selected.warm_id, weight: $scope.weight})
       .then(function(response){
         $scope.calculation = response.data;
       })
     }
}]);


// Login HTML - Kate
app.controller('loginCtrl', ['$scope', '$http', 'authService', function($scope, $http, authService) {
    $scope.login = function () {
        $http({
            method: 'POST',
            url: '/login',
            data: $scope.user
        }).then(function(response){
            authService.saveToken(response.data.token);
        })
    }
}]);

// Register HTML - Madeline
app.controller('createAccountCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.user = {};

    $scope.processForm = function (user) {
        console.log("Posting...");
        $http({
            method: 'POST',
            url: '/register',
            data: $scope.user,
            dataType: 'json'
        }).then(function (response) {
            console.log(response);
            alert("Your account has been created.")
        })
    };
}]);

// Project HTML - Dashboard HTML - Kim
app.controller('projectsCtrl', ['$scope', '$http', function($scope, $http) {
    $http({
        method: 'POST',
        url: 'http://www.w3schools.com/angular/customers.php'
    }).then(function (response) {
        $scope.names = response.records;
    });


}]);

// Services for authentication
app.service('authService', ['$window', function ($window){
    this.parseJwt = function (token) {
        if (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        } else return {};
    };

    this.saveToken = function (token) {
        $window.localStorage.jwtToken = token;
        console.log('Saved token:',$window.localStorage.jwtToken);
    };

    this.getToken = function () {
        return $window.localStorage.jwtToken;
    };

    this.isAuthed = function () {
        var token = this.getToken();
        if (token) {
            var params = this.parseJwt(token);
            var notExpired = Math.round(new Date().getTime() / 1000) <= params.exp;
            if (!notExpired) {
                this.logout();
            }
            return notExpired;
        } else {
            return false;
        }
    };

    this.logout = function () {
        delete $window.localStorage.jwtToken;
    };

    // expose user as an object
    this.getUser = function () {
        return this.parseJwt(this.getToken())
    };
}]);

app.factory('authInterceptor', ['$q', '$location', 'authService', function ($q, $location, authService) {
    return {
        request: function (config) {
            config.headers = config.headers || {};
            if (authService.isAuthed()) {
                config.headers.Authorization = 'Bearer ' + authService.getToken();
            }
            return config;
        },
        response: function (response) {

            if (response.status === 401) {

                // handle the case where the user is not authenticated
                $location.path("/login");
            }
            return response || $q.when(response);
        }, responseError: function (response) {
            if (response.status === 401) {
                $location.path("/login");

            } else {
                console.log(response);
            }
            return $q.reject(response);
        }
    };
}]);

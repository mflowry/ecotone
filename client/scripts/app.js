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
            controller: 'calculateCtrl'
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

    //M//designate controller
    app.controller('calculateCtrl', ['$scope', '$http', function($scope, $http) {

        $scope.newCalculation = function(){
            var weight = parseFloat($scope.calculate.weight)*$scope.conversion;
            console.log($scope.selected);
            console.log(weight);
        };
       // loadCategories();


//autocomplete functionality
        $scope.querySearch=function(query) {
            console.log($scope.list.filter(createFilterFor(query)));
            return query ? $scope.list.filter(createFilterFor(query)) : $scope.list;
        };

        function loadCategories() {
            $http.get('/materials').then(function(response) {
                var list = [];
                response.data.forEach(function( item ){
                    list.push( item.primary_cat )
                });
                $scope.list = list;
            });

        };

//load the units
        $scope.units = [
            {
            name: 'lbs',
            conversion: 0.0005
            },
            {
            name: 'kilos',
            conversion: 0.00110231
            },
            {
            name: 'tons',
            conversion: 1
            },
            {
            name: 'metric tons',
            conversion: 1.10231
            }
        ];



//Create filter function for a query string
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            //console.log(query);
            return function filterFn(obj) {
                //console.log(obj.primary_cat);
                return (obj.primary_cat.indexOf(lowercaseQuery) != -1);
            };
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
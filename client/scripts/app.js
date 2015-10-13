var app = angular.module('ecotoneApp', ['ngRoute', 'ngMaterial', 'ngMessages']);

app.config(['$mdThemingProvider', '$routeProvider', '$locationProvider', '$httpProvider', function($mdThemingProvider, $routeProvider, $locationProvider, $httpProvider){
    $locationProvider.html5Mode(true);

    //set theme and color palette
    $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('blue-grey', {'default':'600'})
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

app.controller('calculateCtrl', ['$scope', '$http', function($scope, $http) {
    // INIT
    $http.get('/materials').then(function(response) {
        var list = response.data;

        list.forEach(function(item){
            item.primary_cat = item.primary_cat.toLowerCase();
            // /item.primary_cat = item.primary_cat.charAt(0).toUpperCase() + item.primary_cat.slice(1).toLowerCase();

        });
        self.list = list;

    });

    // Self dec
    var self = this;

    self.list = '';
    self.result = '';
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.units = [
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
    self.newCalculation = newCalculation;


    function searchTextChange(text) {
        console.log('Text changed to ', text);
    }

    function selectedItemChange(item) {
        if ( item == undefined ) {
            self.category = '';
            self.subcategory = '';
            self.warmId = '';
            self.weight = '';
            self.conversion = '';
            self.result = '';
        }
    }

    function newCalculation() {

        var calculate = {
            warmId: self.warmId || self.category.secondaries[0].warm_id,
            weight: parseFloat(self.weight) * self.conversion
        };

        $http.post('/calculations', calculate).then(function(response) {
            self.result = Math.floor(Math.abs(response.data) * 1000) / 1000;
        });
    }

    function saveToProject(){
        var lineItem = {
            category: self.category,
            subcategory: self.subcategory,
            warm_Id: self.warmId,
            weight: parseFloat(self.weight)*self.conversion,
            units: self.unit.name
        };
        console.log(lineItem);
        $http.post('/addToProject').then(function(response) {
            console.log(response);
        });
    }

    function querySearch(query) {
        return query ? self.list.filter(createFilterFor(query)) : self.list;
    }

    function createFilterFor(query) {
        var lowercaseQuery = query.toLowerCase();
        //query.charAt(0).toUpperCase() + query.slice(1);
        return function filterFn(obj) {
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

// Project Page -  Kim/Madeleine
app.controller('projectsCtrl', ['$scope', '$http', function($scope, $http) {
    //load project list on page load
    $http.get('/project').then(function(response) {
        console.log(response);
        $scope.projectList = response.data;
        //response.data.forEach(function(item){
        //    item.project_name = item.primary_cat.toLowerCase();
        });

    $scope.deleteProjectItem = function (lineID) {
        console.log("Deleting..." , $scope.projectlist.lineID);
        $http.update('/project').then(function(response) {
            //findOne and delete by ID using projectlist.lineID
            console.log("Item was deleted.", response);
    });
        $scope.calculateProjectTotal(){
        //forEach project
            var projectTotal+=projectList.co2_offset;
            return projectTotal;
        //save to project? or just recalc each time?
        }
    }
};


//Dashboard Page - Kim/Madeleine
app.controller('dashboardCtrl', ['$scope', '$http', function($scope, $http) {
    //load project list on page load
    $http.get('/project').then(function(response) {
        console.log(response);
        $scope.projectList = response.data;
        //response.data.forEach(function(item){
        //    item.project_name = item.primary_cat.toLowerCase();
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
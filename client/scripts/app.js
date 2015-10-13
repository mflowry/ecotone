var app = angular.module('ecotoneApp', ['ngRoute', 'ngMaterial', 'ngMessages', 'validation.match']);

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
            controller: 'calculateCtrl as ctrl'
        }).when('/login',
        {
            templateUrl: '/views/login.html',
            controller: 'loginCtrl'
        }).when('/register',
        {
            templateUrl: '/views/register.html',
            controller: 'createAccountCtrl'
        }).when('/admin',
        {
            templateUrl: '/views/admin.html',
            controller: 'adminCtrl as ctrl'

        }).when('/account',
        {
            templateUrl: '/views/account.html',
            controller: ''
        }).when('/dashboard',
        {
            templateUrl: '/views/dashboard.html',
            controller: 'dashboardCtrl'
        }).when('/projects',
        {
            templateUrl: '/views/project.html',
            controller: 'projectsCtrl as ctrl'
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
        }).when('/sources',
        {
            templateUrl: '/views/sources.html'
        }).otherwise({
            redirectTo: '/'
        });

    //$httpProvider.interceptors.push('authInterceptor');
}]);

app.controller('calculateCtrl', ['$http', '$mdDialog', '$rootScope', 'authService', '$location', function( $http, $mdDialog, $rootScope, authService, $location ) {

    // Check user
    $rootScope.user = authService.getUser();

    if($rootScope.user && $rootScope.user.username){
        $location.path('/');
    }

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
    self.isDisabled = false;
    self.result = '';
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.newSuggestion = newSuggestion;
    self.submitSuggestion = submitSuggestion;
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
    self.submission = {
        email: '',
        material: '',
        notes: ''
    };
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

    function submitSuggestion(){
               $http.post('/suggestion', self.submission).then(function( res ){
           $mdDialog.hide();
        });
    }

    function newSuggestion( suggestion ){
        document.getElementById('sidenav').focus();

        $mdDialog.show({
            templateUrl: '/views/submit-modal.html',
            clickOutsideToClose: true,
            controller: 'calculateCtrl',
            controllerAs: 'ctrl',
            locals: {material: self.searchText}
        })

    }


}]);

/**
 * ADMIN
 */
app.controller('adminCtrl', ['$http', function( $http ){
    // INIT
    init();

    var self = this;
    self.suggestions = '';
    self.markComplete = markComplete;

    function markComplete( suggestion ) {
        var id = suggestion.id;
        console.log(id);
        $http.put('/suggestion/complete/' + id).then(function( res ) {
            init();
        });
    }

    function init() {
        $http.get('/suggestion').then(function (res) {
            var suggestions = res.data;
            console.log(suggestions);
            self.suggestions = suggestions;
        });
    }


}]);

// Register HTML - Madeline
app.controller('createAccountCtrl', ['$scope', '$http', '$location', function($scope, $http, $location) {
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
            $location.path('/login');
            alert("Your account has been created.")
        })
    };
}]);


// Login HTML - Kate
app.controller('loginCtrl', ['$scope', '$http', 'authService', '$location', '$rootScope', function($scope, $http, authService, $location, $rootScope) {
    $scope.login = function () {
        $http({
            method: 'POST',
            url: '/login',
            data: $scope.form
        }).then(function(response){
            authService.saveToken(response.data.token);
            $rootScope.user = authService.getUser();
            $location.path('/');
        })
    }
}]);

// Change Navigation Options with Login
app.controller('navCtrl', ['authService', '$scope', '$rootScope', '$location', '$http', function(authService, $scope, $rootScope, $location, $http){
    $rootScope.user = authService.getUser();

    if($rootScope.user && $rootScope.user.username){
        $location.path('/');
    }

    $scope.logout = function(){
        authService.logout();
        $rootScope.user = authService.getUser();
        $location.path('/');
    }
}]);

// Project Page -  Kim/Madeleine
app.controller('projectsCtrl', ['$scope', '$http', function($scope, $http) {

    // Self dec
    var self = this;
    self.projectList = '';
    self.result = '';
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;
    self.projectTotal= 0;
    self.deleteProjectItem = deleteProjectItem;
    self.id = 0;


    //load project list on page load
    self.getProjectList = function() {
        //need to figure out how to pass the userid from the login page--use the same controller?
        $http.get('/project', userid).then(function (response) {
            console.log(response);
            var projectList = response.data;
            projectList.forEach(function (item) {
                project_name = item.project_name.toLowerCase();
                project_description = item.project_description;
                id = item.id;
            });
            self.projectList = projectList;
        });
    };

    function querySearch(query) {
        return query ? self.projectList.filter(createFilterFor(query)) : self.projectList;
    }

    function createFilterFor(query) {
        var lowercaseQuery = query.toLowerCase();
        //query.charAt(0).toUpperCase() + query.slice(1);
        return function filterFn(obj) {
            return (obj.primary_cat.indexOf(lowercaseQuery) != -1);
        };
    }

    function searchTextChange(text) {
        console.log('Text changed to ', text);
    }

    function selectedItemChange(item) {
        if ( item == undefined ) {
            self.project_name = '';
            self.project_description = '';
        }
    }

        function deleteProjectItem() {
        console.log("Deleting...", self.projectList.ID);
        //$http.update('/project').then(function (response) {
        //findOne and delete by id using projectlist.id
        //    console.log("Item was deleted.", response);
        //    self.getProjectList();
        };

        //self.calculateProjectTotal(){
        ////forEach project
        //    var projectTotal+=projectList.co2_offset;
        //    return projectTotal;
        //}
    //};
}]);


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
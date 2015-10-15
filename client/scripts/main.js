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
        }).when('/sources',
        {
            templateUrl: '/views/sources.html'
        }).otherwise({
            redirectTo: '/'
        });

    //$httpProvider.interceptors.push('authInterceptor');
}]);
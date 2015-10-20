var app = angular.module('ecotoneApp', ['ngRoute', 'ngMaterial', 'ngMessages', 'validation.match']);

app.config(['$mdThemingProvider', '$routeProvider', '$locationProvider', '$httpProvider', function($mdThemingProvider, $routeProvider, $locationProvider, $httpProvider){
    $locationProvider.html5Mode(true);

    var customPrimary = {
        '50': '#90b183',
        '100': '#82a774',
        '200': '#739d64',
        '300': '#688e5a',
        '400': '#5c7f50',
        '500': '516F46',
        '600': '#465f3c',
        '700': '#3a5032',
        '800': '#2f4028',
        '900': '#23301f',
        'A100': '#9ebb93',
        'A200': '#acc5a3',
        'A400': '#bacfb2',
        'A700': '#182115'
    };
    $mdThemingProvider
        .definePalette('customPrimary',
        customPrimary);

    var customAccent = {
        '50': '#4e82b4',
        '100': '#4575a4',
        '200': '#3e6992',
        '300': '#365c80',
        '400': '#2f4f6e',
        '500': '27425C',
        '600': '#1f354a',
        '700': '#182838',
        '800': '#101b26',
        '900': '#090f14',
        'A100': '#608fbc',
        'A200': '#729bc3',
        'A400': '#84a8cb',
        'A700': '#010202'
    };
    $mdThemingProvider
        .definePalette('customAccent',
        customAccent);

    var customWarn = {
        '50': '#cbca76',
        '100': '#c5c263',
        '200': '#bebb51',
        '300': '#b2b043',
        '400': '#9f9d3c',
        '500': '8D8B35',
        '600': '#7a792e',
        '700': '#686627',
        '800': '#555420',
        '900': '#434219',
        'A100': '#d2d188',
        'A200': '#d9d89b',
        'A400': '#e0dfae',
        'A700': '#303012'
    };
    $mdThemingProvider
        .definePalette('customWarn',
        customWarn);

    var customBackground = {
        '50': '#eaeaea',
        '100': '#dddddd',
        '200': '#d0d0d0',
        '300': '#c3c3c3',
        '400': '#b7b7b7',
        '500': 'aaa',
        '600': '#9d9d9d',
        '700': '#909090',
        '800': '#848484',
        '900': '#777777',
        'A100': '#f6f6f6',
        'A200': '#ffffff',
        'A400': '#ffffff',
        'A700': '#6a6a6a'
    };
    $mdThemingProvider
        .definePalette('customBackground',
        customBackground);

    $mdThemingProvider.theme('default')
        .primaryPalette('customPrimary')
        .accentPalette('customAccent')
        .warnPalette('customWarn')
        .backgroundPalette('customBackground')


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
            controller: 'dashboardCtrl as ctrl'
        }).when('/projects',
        {
            templateUrl: '/views/project.html',
            controller: 'projectsCtrl as ctrl'
        }).when('/createProject',
        {
            templateUrl: '/views/createProject.html',
            controller: 'createProjectCtrl as ctrl'
        }).when('/sources',
        {
            templateUrl: '/views/sources.html'
        }).otherwise({
            redirectTo: '/'
        });

    $httpProvider.interceptors.push('authInterceptor');
}]);
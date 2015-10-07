var app = angular.module('calculatorApp', ['ngMaterial', 'ngMessages']);

app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('blue')
        .warnPalette ('orange');
});

app.controller('calcCtrl', ['$scope', '$http', function($scope, $http){
    $scope.major = [
        'Category 1',
        'Category 2',
        'Category 3'
    ];
    $scope.sub = [
        'Sub-category 1',
        'Sub-category 2',
        'Sub-category 3'
    ];
    $scope.unit = [
        'lbs',
        'tons',
        'kg'
    ];

}]);

app.controller('createAccountCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.user = {};

    $scope.processForm = function (user) {
        console.log("Posting...");
        $http({
            method: 'POST',
            url: '/newUser',
            data: $scope.user,
            dataType: 'json'
        }).then(function (response) {
            console.log(response);
            alert("Your account has been created.")
        })
    };

}]);


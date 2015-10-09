var app = angular.module('calculatorApp', ['ngMaterial'])


//does stuff, but also keeps the color in the header so don't delete like I keep doing.
app.controller('AppCtrl', ['$scope', '$mdSidenav', function($scope, $mdSidenav){
  $scope.toggleSidenav = function(menuId) {
    $mdSidenav(menuId).toggle();
  
  };
 
}]);

//color pallette
app.config(function($mdThemingProvider) {
 $mdThemingProvider.theme('default')
   .primaryPalette('green')
   .accentPalette('blue')
   .warnPalette ('orange');
});

//This is for the table on the dashboard
var app = angular.module('myApp', []);
app.controller('projectsCtrl', function($scope, $http) {
    $http.get("http://www.w3schools.com/angular/customers.php")
    .success(function (response) {$scope.names = response.records;});
});


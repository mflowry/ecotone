var app = angular.module('createAccountApp',['ngMaterial', 'ngMessages']);
​
app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('green')
    .accentPalette('blue')
    .warnPalette ('orange');
});
  
  app.controller('createAccountCtrl', ['$scope', '$http', function($scope, $http) {
    $scope.user = {};
​
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
​
​
​
 
}]);
​
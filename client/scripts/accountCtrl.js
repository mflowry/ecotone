
// Edit account info HTML - Kim
app.controller('editAccountCtrl', ['$scope', '$http', '$location', '$rootScope', function($scope, $http, $location, $rootScope) {
    $scope.user = $rootScope.user;
    var infoToUpdate =
    $scope.user = {};

    $scope.updateUserInfo = function (user) {
        console.log("Posting...");
        $http({
            method: 'POST',
            url: '/modifyUser',
            data: user,
            dataType: 'json'
        }).then(function (response) {
            console.log(response);
            $location.path('/calculator');
            alert("Your account information has been changed.")
        }, function(error){
            console.log('error');
            alert("There was a problem processing your changes. Please try again later.")
        });
    };
}]);

// Edit account info HTML - Kim
app.controller('editAccountCtrl', ['$scope', '$http', '$location', '$rootScope', '$mdToast', function($scope, $http, $location, $rootScope, $mdToast) {
    $scope.user = {};
    console.log($rootScope.user);
    $scope.user = $rootScope.user;

    $scope.updateUserInfo = function () {
        console.log("Posting...");
        $http({
            method: 'PUT',
            url: '/modifyUser',
            data: $scope.user,
            dataType: 'json'
        }).then(function (response) {
            console.log(response);
            $location.path('/calculator');
            alert("Your account information has been changed.")
        }, function(error){
            console.log('error');
            $scope.errorToast("There was a problem processing your changes. Please try again later.")
        });
    };

    $scope.errorToast = function(message) {
        $mdToast.show(
            $mdToast.simple()
                .content(message)
                .hideDelay(3000)
        );
    };

}]);
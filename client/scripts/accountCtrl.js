
// Edit account info HTML - Kim
app.controller('editAccountCtrl', ['$scope', '$http', '$location', '$rootScope', 'showToast', function($scope, $http, $location, $rootScope, showToast) {
    $scope.user = {};
    $scope.user = $rootScope.user;

    $scope.updateUserInfo = function () {
        $http({
            method: 'PUT',
            url: '/modifyUser',
            data: $scope.user,
            dataType: 'json'
        }).then(function (response) {
            $location.path('/calculator');
            showToast.showToast("Your account information has been changed.")
        }, function(error){
            console.log('error');
            showToast.showToast("There was a problem processing your changes. Please try again later.")
        });
    };

}]);
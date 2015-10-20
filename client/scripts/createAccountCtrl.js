// Register HTML - Madeline
app.controller('createAccountCtrl', ['$scope', '$http', '$location','showToast', function($scope, $http, $location, showToast) {
    $scope.user = {};

    $scope.processForm = function (user) {
        $http({
            method: 'POST',
            url: '/register',
            data: $scope.user,
            dataType: 'json'
        }).then(function (response) {
            console.log(response);
            $location.path('/login');
            showToast.showToast("Your account has been created.");
        }, function(err){
            console.log(err);
            showToast.showToast(err.data.message);
        })
    };

}]);
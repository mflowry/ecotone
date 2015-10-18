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
// Login HTML - Kate
app.controller('loginCtrl', ['$scope', '$http', 'authService', '$location', '$rootScope','showToast', function($scope, $http, authService, $location, $rootScope, showToast) {
    $scope.login = function () {
        $http({
            method: 'POST',
            url: '/login',
            data: $scope.form
        }).then(function(response){
            authService.saveToken(response.data.token);
            $rootScope.user = authService.getUser();
            $location.path('/');
        }, function(err){
            //console.log(err);
            showToast.showToast(err.data.message);
        })
    };
}]);
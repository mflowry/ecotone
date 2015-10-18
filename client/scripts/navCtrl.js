// Change Navigation Options with Login
app.controller('navCtrl', ['authService', '$scope', '$rootScope', '$location', '$http', function(authService, $scope, $rootScope, $location, $http){
    $rootScope.user = authService.getUser();

    if($rootScope.user && $rootScope.user.username){
        $location.path('/');
    }

    $scope.logout = function(){
        authService.logout();
        $rootScope.user = authService.getUser();
        $location.path('/');
    }
}]);

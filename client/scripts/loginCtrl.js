app.controller('loginCtrl', ['$scope', '$http', 'authService', '$location', '$rootScope','showToast', '$mdDialog', function($scope, $http, authService, $location, $rootScope, showToast, $mdDialog) {

    $scope.login = function () {
        $http({
            method: 'POST',
            url: '/login',
            data: $scope.form
        }).then(function( response ){

            authService.saveToken(response.data.token);
            $rootScope.user = authService.getUser();
            $location.path('/dashboard');

        }, function(err){
            //console.log(err);
            showToast.showToast(err.data.message);
        })
    };

    $scope.submitReset = function () {
        console.log(this.email);
        $http.post('/forgot', {email: this.email}).then(function( res ){
            $mdDialog.hide();
        });
    };

    $scope.resetPassword = function() {

        $mdDialog.show({
            templateUrl: '/views/reset-modal.html',
            clickOutsideToClose: true,
            controller: 'loginCtrl',
            controllerAs: 'ctrl'
        })

    }
}]);
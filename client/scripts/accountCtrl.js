
// Edit account info HTML - Kim
app.controller('editAccountCtrl', ['$scope', '$http', '$location', '$rootScope', 'showToast', '$mdDialog', function($scope, $http, $location, $rootScope, showToast, $mdDialog) {
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

    $scope.submitReset = function () {
        $http.post('/forgot', {email: this.email}).then(function( res ){
            showToast.showToast('An email with password reset instructions has been sent.');
            $mdDialog.hide();
        }, function(err){
            console.log(err);
            showToast.showToast(err.data.message);
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
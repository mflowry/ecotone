app.controller('resetCtrl', ['$routeParams','$http','showToast','$location', function($routeParams,$http,showToast,$location) {
    var token = $routeParams.token;
    var self = this;
    self.password = '';
    self.confirmPassword = '';

    self.resetPassword = resetPassword;


    function resetPassword(){
        //self.projectSubmission.user_id = $rootScope.user.id;
        $http.post('/reset/' + token,{password: self.password}).then(function(res){
            $location.path('/login');
        },function(err){
            console.log(err);
            showToast.showToast(err.data.message);
        })
    }
}]);
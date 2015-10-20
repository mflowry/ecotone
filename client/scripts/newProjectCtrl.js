app.controller('newProjectCtrl', [ '$location', '$rootScope', 'authService', '$http', function( $location, $rootScope, authService, $http) {

    $rootScope.user = authService.getUser();

    var self = this;

    self.createProject = createProject;

    console.log(self.projectSubmission);
    console.log($rootScope.user);

    function createProject() {
        self.projectSubmission.user_id = $rootScope.user.id;
        console.log(self.projectSubmission);


        $http.post('/project', self.projectSubmission).then(function(res){
            $location.path('/');
        })
    }

}]);
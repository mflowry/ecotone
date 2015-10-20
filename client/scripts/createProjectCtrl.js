app.controller('createProjectCtrl', ['$location', '$rootScope', 'authService', '$http', function($location, $rootScope, authService, $http){

    $rootScope.user = authService.getUser();

    var self = this;

    self.createProject = createProject;

    function createProject(){
        self.projectSubmission.user_id = $rootScope.user.id;

        $http.post('/project', self.projectSubmission).then(function(res){
            $location.path('/projects');
        })
    }

}]);
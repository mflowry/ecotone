app.controller('createProjectCtrl', ['projectMethods', '$location', '$rootScope', 'authService', '$http', function(projectMethods, $location, $rootScope, authService, $http){

    $rootScope.user = authService.getUser();

    var self = this;

    self.createProject = createProject;

    function createProject(){
        self.projectSubmission.user_id = $rootScope.user.id;

        $http.post('/project', self.projectSubmission).then(function(res){
            projectMethods.setSelectedProject(res.data);
            $location.path('/projects');
        })
    }

}]);
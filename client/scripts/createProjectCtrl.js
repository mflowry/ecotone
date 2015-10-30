app.controller('createProjectCtrl', ['projectMethods', '$location', '$rootScope', 'authService', '$http','showToast', function(projectMethods, $location, $rootScope, authService, $http, showToast){

    $rootScope.user = authService.getUser();

    var self = this;

    self.createProject = createProject;

    function createProject(){
        self.projectSubmission.user_id = $rootScope.user.id

        $http.post('/project', self.projectSubmission).then(function(res){
            projectMethods.setSelectedProject(res.data);
            $location.path('/projects');
        },function(err){
            if(err){
                console.log(err);
                showToast.showToast(err.data.message);
            }
        })
    }

}]);
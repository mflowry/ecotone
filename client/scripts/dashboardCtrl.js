app.controller('dashboardCtrl', ['projectMethods', '$mdDialog', '$rootScope', '$scope', '$http', function(projectMethods, $mdDialog, $rootScope, $scope, $http) {
    var user=$rootScope.user;

    $scope.showDelete = function(ev) {

        console.log('CLICK');
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to remove your project?')
            .content('This is permanent.')
            .ariaLabel('Remove project from account permanently')
            .ok('Remove')
            .cancel('Cancel')
            .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
            $scope.alert = 'Your project has been removed.';
        }, function() {
            $scope.alert = 'Your project has not been removed.';
        });
    };

    self = this;
    self.newProject = newProject;
    self.createProject = createProject;
    projectMethods.getProjectNames(function (names) {
        self.projects = names;
        console.log(names);
    });

    function createProject() {
        self.projectSubmission.user_id = $rootScope.user.id;

        $http.post('/project', self.projectSubmission).then(function(res){
            $mdDialog.hide();
        })
    }

    function newProject( newProject ){

        $mdDialog.show({
            templateUrl: 'views/project-modal.html',
            clickOutsideToClose: true,
            controller: 'dashboardCtrl',
            controllerAs: 'ctrl'
        })

    }

    function calculateTotalCO2(){
      projectMethods.getAllProjectItems( function( items ){
          console.log(items);
      })
    };

    calculateTotalCO2();


}]);
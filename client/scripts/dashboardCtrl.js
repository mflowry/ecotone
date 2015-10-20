app.controller('dashboardCtrl', ['$location', 'projectMethods', '$mdDialog', '$rootScope', '$scope', '$http', function($location, projectMethods, $mdDialog, $rootScope, $scope, $http) {
    var user=$rootScope.user;

    $scope.showDelete = function(project) {

        console.log('CLICK');
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to remove your project?')
            .content('This is permanent.')
            .ariaLabel('Remove project from account permanently')
            .ok('Remove')
            .cancel('Cancel')
        $mdDialog.show(confirm).then(function() {
            console.log(project);
            $http.delete('/project/' + project.id).then(function( res ){
               if( res.status == 200 ){
                   projectMethods.getProjectNames(function (names) {
                       self.projects = names;
                       console.log(names);
                   });
               }
            });

            $scope.alert = 'Your project has been removed.';
        }, function() {
            $scope.alert = 'Your project has not been removed.';
        });
    };

    self = this;

    // get the active projects
    projectMethods.getProjectNames(function (names) {
        self.projects = names;
        console.log(names);
    });

    function calculateTotalCO2(){
      projectMethods.getAllProjectItems( function( items ){
          console.log(items);
      })
    };


    calculateTotalCO2();


}]);
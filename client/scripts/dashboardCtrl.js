app.controller('dashboardCtrl', ['$location', 'projectMethods', '$mdDialog', '$rootScope', '$scope', '$http', function($location, projectMethods, $mdDialog, $rootScope, $scope, $http) {
    var user=$rootScope.user;

    // INIT
    //var self = this;
    //self.selected_project = projectMethods.getSelectedProject();
    //self.result = '';
    //self.querySearch = querySearch;
    //self.selectedItemChange = selectedItemChange;
    //self.searchTextChange = searchTextChange;
    //self.projectItems = '';
    //self.projectTotal = 0;
    //self.deleteProjectItem = deleteProjectItem;
    //self.id = 0;
    //self.calculateProjectTotal = calculateProjectTotal;
    //projectMethods.getProjectNames( function( list ) {
    //    self.projectList = list;
    //});

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
////Total projects C02 calculation
//    function calculateProjectTotal() {
//        console.log("calculating...");
//        projectTotal = 0;
//        self.projectItems.forEach(function (item) {
//            projectTotal += item.co2_offset;
//            console.log(projectTotal);
//        });
//        console.log(projectTotal);
//        self.projectTotal = Math.floor(projectTotal * 100) / 100;
//    }


}]);
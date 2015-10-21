app.controller('dashboardCtrl', ['$location', 'projectMethods', '$mdDialog', '$rootScope', '$scope', '$http', function($location, projectMethods, $mdDialog, $rootScope, $scope, $http) {

    self = this;
    self.selectProject= selectProject;
    self.selectItems= '';
    //self.grandTotal= grandTotal;
    self.projects = '';
    self.Co2GrandTotal = 0;
    self.getAllItems= getAllItems;
    self.calculateGrandTotal= calculateGrandTotal;

    $scope.showDelete = function(project) {
        console.log('CLICK');
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to remove your project?')
            .content('This is permanent.')
            .ariaLabel('Remove project from account permanently')
            .ok('Remove')
            .cancel('Cancel');
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


    // get the active projects
    projectMethods.getProjectNames(function (names) {
        self.projects = names;
        console.log(names);
    });
    getAllItems();


    function selectProject(project){
        console.log(project);
        projectMethods.setSelectedProject(project);

        $location.path('/projects');
    }

    function getAllItems() {
        projectMethods.getAllProjectItems().then(function( items ){
            self.selectItems = items;
            calculateGrandTotal();
        });
    }

    function calculateGrandTotal() {

            self.selectItems.forEach(function (item) {
                self.Co2GrandTotal += item.co2_offset;
            });
        }
}]);
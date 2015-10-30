app.controller('dashboardCtrl', ['$location', 'projectMethods', '$mdDialog', '$rootScope', '$scope', '$http', function($location, projectMethods, $mdDialog, $rootScope, $scope, $http) {

    self = this;
    self.selectProject= selectProject;
    self.selectItems= '';
    self.projects = '';
    self.Co2GrandTotal = 0;
    self.getAllItems= getAllItems;
    self.calculateGrandTotal= calculateGrandTotal;
    self.calcProjectTotal = calcProjectTotal;
    self.projects.id = '';
    self.projectItems = '';
    self.projectTotal = 0;


    $scope.showDelete = function(project) {
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to remove your project?')
            .content('This is permanent.')
            .ariaLabel('Remove project from account permanently')
            .ok('Remove')
            .cancel('Cancel');
        $mdDialog.show(confirm).then(function() {
            $http.delete('/project/' + project.id).then(function( res ){
               if( res.status == 200 ){
                   projectMethods.getProjectNames(function (names) {
                       self.projects = names;
                       calcProjectTotal();
                       getAllItems();
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
        calcProjectTotal();
    });
    getAllItems();


//select a project to edit
    function selectProject(project){
        projectMethods.setSelectedProject(project);

        $location.path('/projects');
    }

//get all calculations for all projects to calc Grand Total CO2
    function getAllItems() {
    projectMethods.getAllProjectItems().then(function( items ){
        self.selectItems = items;
        calculateGrandTotal();
        });
    }

    //calculate the Grand Total
    function calculateGrandTotal() {

        var GrandTotal = 0;
        self.selectItems.forEach(function (item) {
        GrandTotal += item.co2_offset;
            self.Co2GrandTotal=Math.floor(GrandTotal * 10000)/10000;
            });
        }

    //calculate co2 for each project
    function calcProjectTotal() {
        self.projects.forEach(function (project) {
            projectMethods.getProjectItemsByProjectId(project.id).then(function(items){
                var projectSum=0;
                items.forEach(function(calculation){
                    projectSum += calculation.co2_offset;
                });
                project.projectTotal= Math.floor(projectSum * 10000)/10000;
            });

        })
    }


}]);
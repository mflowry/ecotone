app.controller('dashboardCtrl', ['$mdDialog', '$rootScope', '$scope', '$http', function($mdDialog, $rootScope, $scope, $http) {
    var user=$rootScope.user;


    //load project list on page load
    $http.get('/project/' + user.id).then(function(response) {
        $scope.projectList = response.data;
        //response.data.forEach(function(item){
        //    item.project_name = item.primary_cat.toLowerCase();
    });
//this is for the remove project modal alert for removing a project, data will still be in database-- still not working correct

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

    //need to check if we need this!
//    function DialogController($scope, $mdDialog) {
//    $scope.hide = function() {
//        $mdDialog.hide();
//    };
//    $scope.cancel = function() {
//        $mdDialog.cancel();
//    };
//    $scope.answer = function(answer) {
//        $mdDialog.hide(answer);
//    };
//}
    self = this;
    self.newProject = newProject;
    self.createProject = createProject;

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

}]);
app.controller('dashboardCtrl', ['$mdDialog', '$scope', '$http', function($mdDialog, $scope, $http) {
    //load project list on page load
    $http.get('/project').then(function(response) {
        console.log(response);
        $scope.projectList = response.data;
        //response.data.forEach(function(item){
        //    item.project_name = item.primary_cat.toLowerCase();
    });
//this is for the delete modal alert for deleting a project-- still not working correct

    $scope.showDelete = function(ev) {

        console.log('CLICK');
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete your project?')
            .content('This is permanent.')
            .ariaLabel('Delete project permanently')
            .ok('Delete')
            .cancel('Cancel')
            .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
            $scope.alert = 'Your project has been deleted.';
        }, function() {
            $scope.alert = 'You project has not been deleted.';
        });
    };
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

}]);
//Dashboard Page - Kim/Madeleine
app.controller('dashboardCtrl', ['$scope', '$http', function($scope, $http) {
    //load project list on page load
    $http.get('/project').then(function(response) {
        console.log(response);
        $scope.projectList = response.data;
        //response.data.forEach(function(item){
        //    item.project_name = item.primary_cat.toLowerCase();
    });
}]);
// Project Page -  Kim/Madeleine
app.controller('projectsCtrl', ['$scope', '$http', function($scope, $http) {

    // Self dec
    var self = this;
    self.projectList = '';
    self.result = '';
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;
    self.projectTotal= 0;
    self.deleteProjectItem = deleteProjectItem;
    self.id = 0;


    //load project list on page load
    self.getProjectList = function() {
        //need to figure out how to pass the userid from the login page--use the same controller?
        $http.get('/project', userid).then(function (response) {
            console.log(response);
            var projectList = response.data;
            projectList.forEach(function (item) {
                item.project_name = item.project_name.toLowerCase();
                //item.project_description = item.project_description;
                //item.itemId = item.id;
                //item.co2_offset = item.co2_offset;
            });
            self.projectList = projectList;
        });
    };

    function querySearch(query) {
        return query ? self.projectList.filter(createFilterFor(query)) : self.projectList;
    }

    function createFilterFor(query) {
        var lowercaseQuery = query.toLowerCase();
        //query.charAt(0).toUpperCase() + query.slice(1);
        return function filterFn(obj) {
            return (obj.primary_cat.indexOf(lowercaseQuery) != -1);
        };
    }

    function searchTextChange(text) {
        console.log('Text changed to ', text);
    }

    function selectedItemChange(item) {
        if ( item == undefined ) {
            self.project_name = '';
            self.project_description = '';
        }
    }

    $scope.showDelete = function(ev) {
        console.log('CLICK');
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete this item?')
            .content('This will be permanent.')
            .ariaLabel('Delete item permanently')
            .ok('Delete')
            .cancel('Cancel')
            .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
            $scope.alert = 'Your item has been deleted.';
        }, function() {
            $scope.alert = 'Your item has not been deleted.';
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

    function deleteProjectItem() {
        console.log("Deleting...", self.projectList.ID);
        //$http.update('/project').then(function (response) {
        //findOne and delete by id using projectlist.id
        //    console.log("Item was deleted.", response);
        //    self.getProjectList();
    };

    //self.calculateProjectTotal(){
    ////forEach project
    //    var projectTotal+=projectList.co2_offset;
    //    return projectTotal;
    //}
    //};
}]);
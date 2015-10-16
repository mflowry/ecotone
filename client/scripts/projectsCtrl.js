// Project Page -  Kim/Madeleine
app.controller('projectsCtrl', ['$mdDialog', '$scope', '$rootScope', '$http', function($mdDialog, $scope, $rootScope, $http) {

    // Self dec
    var self = this;
    self.projectList = '';
        //[
        //        {
        //            id: 21,
        //            project_name: "ben's house",
        //            project_description: "Remodel",
        //            created_at: "2015-10-14T16:42:40.896Z",
        //            updated_at: "2015-10-14T16:42:40.901Z",
        //            user_id: 4,
        //            category: "wood",
        //            sub_category: "oak",
        //            units: "lbs",
        //            weight: 10,
        //            co2_offset: 0.03,
        //            project_id: 6,
        //            item_description: "porch spindles"
        //        },
        //        {
        //            id: 202,
        //            project_name: "james' house",
        //            project_description: "Summit Ave carriage house teardown and rebuild",
        //            created_at: "2014-10-14T16:42:40.896Z",
        //            updated_at: "2014-10-14T16:42:40.901Z",
        //            user_id: 24,
        //            category: "asphalt shingles",
        //            sub_category: "null",
        //            units: "lbs",
        //            weight: 100,
        //            co2_offset: 0.303,
        //            project_id: 6,
        //            item_description: "dark brown roof shingles--30 year life, some water damage"
        //        },
        //        {
        //            id: 2112,
        //            project_name: "kim's barn",
        //            project_description: "Remodel",
        //            created_at: "2013-10-14T16:42:40.896Z",
        //            updated_at: "2013-10-14T16:42:40.901Z",
        //            user_id: 14,
        //            category: "wood flooring",
        //            sub_category: "pine",
        //            units: "lbs",
        //            weight: 500,
        //            co2_offset: 3.03,
        //            project_id: 6,
        //            item_description: "barn wood"
        //        }];

    self.result = '';
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;
    self.projectTotal = 0;
    self.deleteProjectItem = deleteProjectItem;
    self.id = 0;

//console.log(self.projectList);

    //refresh project list
    function getProjectList() {
        $http.get('/project/?user_id=' + $rootScope.user.id)
            .then(function (response) {
                console.log(response);

                var projectList = [];
                var currentProject = response.data[0].project_name;
                var uniqueName = false;
                response.data.forEach(function (item) {
                    //item.project_name = item.project_name.toLowerCase();

                    //projectList.forEach(function (listItem, index, array) {
                    //    if (listItem !== item.project_name) {
                    //        uniqueName = true;
                    //    }
                    //
                    //});
                    //if(item.project_name != currentProject){
                    //    projectList.push(item.project_name);
                    //}
                    //currentProject = item.project_name;

                });

                console.log(projectList);
                //    //item.project_description = item.project_description;
                //    //item.itemId = item.id;
                //    //item.co2_offset = item.co2_offset;
                //});
                //self.projectList = projectList;
        });
    }

    //get items for selected project
    function getProjectItems() {
        $http.get('/project/?user_id=' + $rootScope.user.id + "&project_id=2").then(function (response) {
            console.log(response);
            self.projectItems = response.data;
        });
    }

    //load project list on page load
    getProjectList();


    function querySearch(query) {
        return query ? self.projectList.filter(createFilterFor(query)) : self.projectList;
    }

    function createFilterFor(query) {
        var lowercaseQuery = query.toLowerCase();
        //query.charAt(0).toUpperCase() + query.slice(1);
        return function filterFn(obj) {
            return (obj.project_name.indexOf(lowercaseQuery) != -1);
        };
    }

    function searchTextChange(text) {
        console.log('Text changed to ', text);
    }

    function selectedItemChange(item) {
        console.log('item', item);
        console.log('selected_ project',self.selected_project);
        if ( item == undefined ) {
            self.selected_project = '';
            self.project_description = '';
        }
    }

    $scope.showDelete = function(ev, id) {
        console.log('CLICK');
        var confirm = $mdDialog.confirm()
            .title('Are you sure you want to delete this item?')
            .content('This will be permanent.')
            .ariaLabel('Delete item permanently')
            .ok('Delete')
            .cancel('Cancel')
            .targetEvent(ev);
        $mdDialog.show(confirm).then(function(){
            console.log("Deleting", id);
            self.deleteProjectItem(id);
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

    function deleteProjectItem(id) {
        console.log("Deleting...", id);

        //$http.update('/project', self.id).then(function (response) {
        //findOne and delete by id using projectlist.id
        //    console.log("Item was deleted.", response);
        //    self.getProjectList();
    }

    function saveProject() {
        console.log("Saving...", self.id);
        //save all project fields? how do I even do this?
    };

    function calculateProjectTotal() {
        console.log("calculating...");
        projectList.forEach(function (item) {
            projectTotal += item.co2_offset;
            console.log(projectTotal);
        return projectTotal;

    })
    }



}]);
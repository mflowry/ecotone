// Project Page -  Kim/Madeleine
app.controller('projectsCtrl', ['projectMethods', '$mdDialog', '$scope', '$rootScope', '$http', function(projectMethods, $mdDialog, $scope, $rootScope, $http) {

    // INIT
    var self = this;
    self.selected_project = projectMethods.getSelectedProject();
    self.result = '';
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;
    self.projectItems = '';
    self.projectTotal = 0;
    self.deleteProjectItem = deleteProjectItem;
    self.id = 0;
    self.editableProject = false;
    self.editProject = editProject;
    self.calculateProjectTotal = calculateProjectTotal;
    projectMethods.getProjectNames( function( list ) {
       self.projectList = list;
    });

    if( self.selected_project ) {
        projectMethods.getProjectItems(function (items) {
            self.projectItems = items;
        })
    }
function editProject() {
    console.log("Editing");
    self.editableProject = true;
}
    //refresh project list
    function getProjectList() {
        $http.get('/project/namesById?user_id=' + $rootScope.user.id).then(function (response) {
                self.projectList = res.data;
                console.log("List on load", response);
                var projectList = [];//[response.data[0].project_name];
                var currentProject = projectList[0];
                var duplicate = false;
                response.data.forEach(function (item) {
                    //item.project_name = item.project_name.toLowerCase();

                    //projectList.forEach(function (listItem, index, array) {
                    //    if (listItem !== item.project_name) {
                    //        uniqueName = true;
                    //    }
                    //
                    //});

                    duplicate = projectList.some(function (projectName) {
                        return projectName === item.project_name;
                    });
                    if (!duplicate) {
                        projectList.push(item.project_name);
                        console.log("This is the unduped project list:", projectList);
                    }
                });
                console.log(projectList);
            });
    }

    //load project list on page load
    getProjectList();

    // refresh project list
    function getProjectList() {
        $http.get('/project/namesById?user_id=' + $rootScope.user.id).then(function( res ){
            console.log(res.data);
            self.projectList = res.data;
        })
    }

    //get items for selected project
    function getProjectItems() {
        $http.get('/project/?user_id=' + $rootScope.user.id + "&project_id=2").then(function (response) {
            console.log(response);
            self.projectItems = response.data;
        });
    }


    //load project list on page load
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
        self.projectItems = '';

    }

    function selectedItemChange(item) {
        console.log('item', item);
        projectMethods.setSelectedProject(self.selected_project);
        projectMethods.getProjectItems( function( items ){
            self.projectItems = items;
        });

        if ( item == undefined ) {
            self.projectItems = '';
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
    }

    function calculateProjectTotal() {
        console.log("calculating...");
        projectTotal = 0;
        self.projectItems.forEach(function (item) {
            projectTotal += item.co2_offset;
            console.log(projectTotal);
        });
        console.log(projectTotal);
        self.projectTotal = Math.floor(projectTotal * 100) / 100;
    }
}]);
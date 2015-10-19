app.factory('projectMethods', ['$http', function ( $http ) {

    var selectedProject;

    function setSelectedProject( project ){
        selectedProject = project;
    }

    function getSelectedProject( project ){
        return selectedProject;
    }

    function getProjectNames(){
        $http.get( '/project/namesById?user_id=' + $rootScope.user.id ).then( function( res ){
            return res.data
        })
    }

    function getProjectItems() {
        $http.get( '/project/?user_id=' + $rootScope.user.id + "&project_id=" + selectedProject.id ).then( function (response) {
            console.log( res );
            return  res.data;
        });
    }

    return {

        setSelectedProject: setSelectedProject,

        getProjectNames: getProjectNames,
        getProjectItems: getProjectItems,
        getSelectedProject: getSelectedProject

    }
}]);
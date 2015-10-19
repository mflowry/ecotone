app.factory('projectMethods', ['$http', '$rootScope', function ( $http, $rootScope ) {

    var selectedProject, selectedProjectItems;

    function setSelectedProject( project ){
        selectedProject = project;
        $http.get( '/project/?user_id=' + $rootScope.user.id + "&project_id=" + selectedProject.id ).then( function (res) {
            selectedProjectItems = res.data;
        });
    }

    function getSelectedProject( project ){
        return selectedProject || '';
    }

    function getProjectNames( callback ){
        $http.get( '/project/namesById?user_id=' + $rootScope.user.id ).then( function( res ){
             callback( res.data );
        });
    }

    function getProjectItems( callback ) {
        $http.get( '/project/?user_id=' + $rootScope.user.id + "&project_id=" + selectedProject.id ).then( function (res) {
            callback( res.data );
        });
    }

    function getSelectedProjectItems() {
        return selectedProjectItems;
    }

    return {


        setSelectedProject: setSelectedProject,

        getSelectedProjectItems: getSelectedProjectItems,
        getProjectNames: getProjectNames,
        getProjectItems: getProjectItems,
        getSelectedProject: getSelectedProject

    }
}]);
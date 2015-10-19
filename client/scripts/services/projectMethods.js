app.factory('projectMethods', ['$http', '$rootScope', function ( $http, $rootScope ) {

    var selectedProject;

    function setSelectedProject( project ){
        selectedProject = project;
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

    return {


        setSelectedProject: setSelectedProject,

        getProjectNames: getProjectNames,
        getProjectItems: getProjectItems,
        getSelectedProject: getSelectedProject

    }
}]);
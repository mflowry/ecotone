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

    function getProjectNamesReturn(){
        return $http.get( '/project/namesById?user_id=' + $rootScope.user.id ).then( function( res ){
            return res.data
        });
    }

    function getProjectItems() {
        return $http.get( '/project/?user_id=' + $rootScope.user.id + "&project_id=" + selectedProject.id ).then( function (res) {
            return ( res.data );
        });
    }

    function getProjectItemsByProjectId(id){
        return $http.get( '/project/?user_id=' + $rootScope.user.id + "&project_id=" + id ).then( function (res) {
            return ( res.data );
        });
    }

    function getSelectedProjectItems() {
        return selectedProjectItems;
    }

    function getAllProjectItems(  ) {
        return $http.get( '/project/?user_id='+ $rootScope.user.id).then( function( res ){
            return( res.data )
        })
    }

    return {


        setSelectedProject: setSelectedProject,

        getProjectItemsByProjectId: getProjectItemsByProjectId,
        getProjectNamesReturn: getProjectNamesReturn,
        getAllProjectItems: getAllProjectItems,
        getSelectedProjectItems: getSelectedProjectItems,
        getProjectNames: getProjectNames,
        getProjectItems: getProjectItems,
        getSelectedProject: getSelectedProject

    }
}]);
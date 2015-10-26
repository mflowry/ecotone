app.controller('uploadCtrl', ['$location', '$http', '$scope', 'projectMethods', function($location, $http, $scope, projectMethods ){
    console.log('on upload');

    var self = this;

    self.submitCSV = submitCSV;

    console.log(projectMethods.getSelectedProject().id);
    function submitCSV( ){
        var csvObject = $scope.csv.result;

        $http.post('/bulk', csvObject)
            .then(function( res ){
                res.data.forEach(function(item){
                    item.project_id = projectMethods.getSelectedProject().id;
                });
                return res.data})
            .then(function( projects ) {
                $http.post('/project/calculation/', projects)
                $location.path('/projects')
            }).catch(function(err){
                console.log(err);
            });

    }

    $scope.csv = {
        content: null,
        header: true,
        headerVisible: true,
        separator: ',',
        separatorVisible: true,
        result: null,
        encoding: 'ISO-8859-1',
        encodingVisible: true
    };

    var _lastGoodResult = '';
    $scope.toPrettyJSON = function (json, tabWidth) {
        var objStr = JSON.stringify(json);
        var obj = null;
        try {
            obj = $parse(objStr)({});
        } catch(e){
            // eat $parse error
            return _lastGoodResult;
        }

        var result = JSON.stringify(obj, null, Number(tabWidth));
        _lastGoodResult = result;

        return result;
    };


}]);
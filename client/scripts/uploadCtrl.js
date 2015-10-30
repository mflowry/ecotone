app.controller('uploadCtrl', ['authService', '$location', '$http', '$scope', 'projectMethods', function(authService, $location, $http, $scope, projectMethods ){
    console.log('on upload');

    var self = this;

    self.submitCSV = submitCSV;
    self.buttonDisabled = false;
    self.selected_project = projectMethods.getSelectedProject();
    if (!self.selected_project) {
        $location.path('/dashboard');

    }

    console.log(projectMethods.getSelectedProject().id);
    function submitCSV( ){
        var csvObject = $scope.csv.result;

        self.buttonDisabled = true;
        $http.post('/bulk', csvObject)

            .then(function( calculations ) {
                var calculationsToSend = {
                    calculations: calculations.data,
                    project_id: projectMethods.getSelectedProject().id
                };
                $http.post('/project/csvUpload/', calculationsToSend).then(function(){
                    $location.path('/projects')
                });
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
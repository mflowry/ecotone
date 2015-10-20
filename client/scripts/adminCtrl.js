
app.controller('adminCtrl', ['$http', '$rootScope', '$scope','$parse', function( $http, $rootScope, $scope, $parse ){
    // INIT
    var self = this;
    self.form = {};
    self.suggestions = '';
    self.markComplete = markComplete;
    self.submitCSV = submitCSV;
    self.isLoggedIn = false;

    self.adminTest = adminTest;
    function adminTest() {
        console.log(self.form);
        console.log('admin Test');
        $http.post('/suggestion/getSuggestions', self.form).then(function (res) {
            if(res.status != 404){
                var suggestions = res.data;
                console.log('suggestions', res);
                self.suggestions = suggestions;
                self.isLoggedIn = true;
            }
        });
    }

    function submitCSV( ){
        var csvObject = $scope.csv.result;
        console.log(csvObject);

        $http.post('/bulk', csvObject)
            .then(function( res ){
                console.log(res);
                res.data.forEach(function(item){
                    item.project_id = 1;
                });
                return res.data})
            .then(function( projects ) {
                $http.post('/project/calculation/', projects)
            }).catch(function(err){
                console.log(err);
            });

    }

    function markComplete( suggestion ) {
        var id = suggestion.id;
        console.log(id);
        $http.put('/suggestion/complete/' + id).then(function( res ) {
            init();
        });
    }

    function init() {
        $http.get('/suggestion', {}).then(function (res) {
            var suggestions = res.data;
            console.log(suggestions);
            self.suggestions = suggestions;
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
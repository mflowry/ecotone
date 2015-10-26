
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
                console.log(res.data);
                var suggestions = res.data;
                self.suggestions = suggestions;
                self.isLoggedIn = true;
            }
        });
    }



    function markComplete( suggestion ) {
        var id = suggestion.id;
        $http.put('/suggestion/complete/' + id).then(function( res ) {
            init();
        });
    }

    function init() {
        console.log(self.form);
        $http.post('/suggestion/getSuggestions',self.form).then(function (res) {
            var suggestions = res.data;
            self.suggestions = suggestions;
        });
    }


}]);
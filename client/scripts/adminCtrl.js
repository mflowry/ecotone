/**
 * ADMIN
 */
app.controller('adminCtrl', ['$http', function( $http ){
    // INIT
    init();

    var self = this;
    self.suggestions = '';
    self.markComplete = markComplete;

    function markComplete( suggestion ) {
        var id = suggestion.id;
        console.log(id);
        $http.put('/suggestion/complete/' + id).then(function( res ) {
            init();
        });
    }

    function init() {
        $http.get('/suggestion').then(function (res) {
            var suggestions = res.data;
            console.log(suggestions);
            self.suggestions = suggestions;
        });
    }


}]);
app.service('showToast', ['$mdToast', function($mdToast){

    this.showToast = function(message) {
        $mdToast.show(
            $mdToast.simple()
                .content(message)
                .hideDelay(3000)
                .position('top right')
        );
    };
}]);
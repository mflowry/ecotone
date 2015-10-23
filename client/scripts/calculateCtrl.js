app.controller('calculateCtrl', ['calculator', '$scope', 'projectMethods', '$timeout', '$http', '$mdDialog', '$rootScope', 'authService', '$location', 'showToast',
    function( calculator, $scope, projectMethods, $timeout, $http, $mdDialog, $rootScope, authService, $location, showToast ) {

    // Check user
    $rootScope.user = authService.getUser();

    if($rootScope.user && $rootScope.user.username){
        $location.path('/');
    }

    // INIT



    // Self dec
    var self = this;

    self.list = '';
    self.isDisabled = false;
    self.result = '';
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.newSuggestion = newSuggestion;
    self.newCalculation = newCalculation;
    self.submitSuggestion = submitSuggestion;

    calculator.getMaterials().then(function( list ){
        self.list = list;
    });

    self.units = calculator.getUnits();


    if(authService.isAuthed()) {
        projectMethods.getProjectNames(function (names) {
            self.projects = names;
        });
    }
    self.setSelectedProject = function(){
        projectMethods.setSelectedProject( self.selected_project );
    };


    function searchTextChange(text) {
        console.log('Text changed to ', text);
    }

    function selectedItemChange(item) {
        if ( item == undefined ) {
            self.category = '';
            self.subcategory = '';
            self.warmId = '';
            self.weight = '';
            self.item_description = '';
            self.selected_unit = '';
            self.result = '';
        }
    }

    function newCalculation() {

        console.log('click');



        if(self.subcategory == undefined) {
            self.subcategory = self.category.secondaries[0];
        }

        console.log(self.subcategory);
        var calculation = {
            warmId: self.subcategory.warm_id,
            weight: parseFloat(self.weight) * self.selected_unit.conversion
        };


        calculator.newCalculation( calculation ).then(function( answer ){

                self.result = answer;


                if (authService.isAuthed() && self.selected_project) {

                    var calcToSave = [{}];
                    calcToSave[0].project_id = self.selected_project.id;
                    calcToSave[0].category = self.category.primary_cat;
                    calcToSave[0].sub_category = self.subcategory.secondary_cat || null;
                    calcToSave[0].units = self.selected_unit.name;
                    calcToSave[0].weight = self.weight;
                    calcToSave[0].co2_offset = self.result;
                    calcToSave[0].item_description = self.item_description;

                    calculator.saveCalculation(calcToSave)

                }

        });

    }

    function querySearch(query) {
        return query ? self.list.filter(createFilterFor(query)) : self.list;
    }

    function createFilterFor(query) {
        var lowercaseQuery = query.toLowerCase();
        //query.charAt(0).toUpperCase() + query.slice(1);
        return function filterFn(obj) {
            return (obj.primary_cat.indexOf(lowercaseQuery) != -1);
        };
    }

    function submitSuggestion(){
        $http.post('/suggestion', self.suggestSubmission).then(function( res ){
            if(res.data.message){
                showToast.showToast(res.data.message);
                $mdDialog.hide();
            }

        }, function(err){
            if(err){
                console.log(err);
                showToast.showToast(err.data.message);
                $mdDialog.hide();
            }
        });
    }

    function newSuggestion( suggestion ){

        $mdDialog.show({
            templateUrl: '/views/suggest-modal.html',
            clickOutsideToClose: true,
            controller: 'calculateCtrl',
            controllerAs: 'ctrl',
            locals: {material: self.searchText}
        })

    }

}]);
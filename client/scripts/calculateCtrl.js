app.controller('calculateCtrl', ['$scope', 'projectMethods', '$timeout', '$http', '$mdDialog', '$rootScope', 'authService', '$location',
    function( $scope, projectMethods, $timeout, $http, $mdDialog, $rootScope, authService, $location ) {

    // Check user
    $rootScope.user = authService.getUser();

    if($rootScope.user && $rootScope.user.username){
        $location.path('/');
    }

    // INIT
    $http.get('/materials').then(function(response) {
        var list = response.data;

        list.forEach(function(item){
            item.primary_cat = item.primary_cat.toLowerCase();
            // /item.primary_cat = item.primary_cat.charAt(0).toUpperCase() + item.primary_cat.slice(1).toLowerCase();

        });
        self.list = list;

    });



    // Self dec
    var self = this;

    self.list = '';
    self.isDisabled = false;
    self.result = '';
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange   = searchTextChange;
    self.newSuggestion = newSuggestion;
    self.submitSuggestion = submitSuggestion;
    self.units = [
        {
            name: 'lbs',
            conversion: 0.0005
        },
        {
            name: 'kilos',
            conversion: 0.00110231
        },
        {
            name: 'tons',
            conversion: 1
        },
        {
            name: 'metric tons',
            conversion: 1.10231
        }
    ];
    self.submission = {
        email: '',
        material: '',
        notes: ''
    };
    self.newCalculation = newCalculation;
    self.saveToProject = saveToProject;
    self.newProject = newProject;
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

        var calculate = {
            warmId: self.warmId || self.category.secondaries[0].warm_id,
            weight: parseFloat(self.weight) * self.selected_unit.conversion
        };

        $http.post('/calculations', calculate).then(function(response) {

            response.data = Math.abs(parseFloat(response.data));

            if (response.data >= .0001) {
                self.result = Math.floor(response.data * 10000) / 10000;
            } else {
                self.result = response.data.toExponential(2);
            }

            if ($rootScope.user) {
                var savedCalculation = [{}];
                savedCalculation[0].project_id = self.selected_project.id;
                savedCalculation[0].category = self.category.primary_cat;
                savedCalculation[0].sub_category = self.subcategory || null;
                savedCalculation[0].units = self.selected_unit.name;
                savedCalculation[0].weight = self.weight;
                console.log(self.result);
                savedCalculation[0].co2_offset = self.result;
                savedCalculation[0].item_description = self.item_description;

                console.log(savedCalculation);

                $http.post('/project/calculation', savedCalculation).then(function (res) {
                    console.log(res);
                })


            }
        });
    }

    function saveToProject(){
        var lineItem = {
            category: self.category,
            subcategory: self.subcategory,
            warm_Id: self.warmId,
            weight: parseFloat(self.weight)*self.selected_unit.conversion,
            units: self.unit.name,
            item_description: self.item_description
        };
        console.log(lineItem);
        $http.post('/addToProject').then(function(response) {
            console.log(response);
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
            $mdDialog.hide();
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



    function newProject( newProject ){

        $location.path('/newProject');

    }

}]);
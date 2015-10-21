// Project Page -  Kim/Madeleine
app.controller('projectsCtrl', ['authService', 'projectMethods', 'calculator', '$mdDialog', '$scope', '$rootScope', '$http',
    function(authService, projectMethods, calculator, $mdDialog, $scope, $rootScope, $http) {

        // INIT
        var self = this;
        self.selected_project = projectMethods.getSelectedProject();
        self.result = '';
        self.querySearch = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange = searchTextChange;
        self.projectItems = '';
        self.projectTotal = 0;
        self.deleteProjectItem = deleteProjectItem;
        self.clearFields = clearFields;
        self.id = 0;
        self.calculateProjectTotal = calculateProjectTotal;
        self.newCalculation = newCalculation;
        self.downloadProject = downloadProject;


        if (self.selected_project) {

            projectMethods.getProjectItems(function (items) {
                self.projectItems = items;
                calculateProjectTotal();
                self.downloadProject();
            })
        }

        self.units = calculator.getUnits();
        console.log(self.units);
        calculator.getMaterials().then(function( list ){
            self.projectList = list;
        });

        function newCalculation() {

            var calculation = {
                warmId: self.warmId || self.category.secondaries[0].warm_id,
                weight: parseFloat(self.weight) * self.selected_unit.conversion
            };

            calculator.newCalculation(calculation).then(function (answer) {

                self.result = answer;

                if (authService.isAuthed() && self.selected_project) {

                    var calcToSave = [{}];
                    calcToSave[0].project_id = self.selected_project.id;
                    calcToSave[0].category = self.category.primary_cat;
                    calcToSave[0].sub_category = self.subcategory || null;
                    calcToSave[0].units = self.selected_unit.name;
                    calcToSave[0].weight = self.weight;
                    calcToSave[0].co2_offset = self.result;
                    calcToSave[0].item_description = self.item_description;

                    calculator.saveCalculation(calcToSave).then(function () {
                        console.log(calcToSave);
                        projectMethods.getProjectItems(function (items) {
                            self.projectItems = items;
                            calculateProjectTotal();
                            clearFields();

                        })
                    });

                }
            })
        };

        //get items for selected project
        function clearFields() {
            self.searchText = "";
            self.category = "";
            self.subcategory = "";
            self.selected_unit = "";
            self.weight = "";
            self.result = "";
            self.item_description = "";
        }


        //load project list on page load
        function querySearch(query) {
            return query ? self.projectList.filter(createFilterFor(query)) : self.projectList;
        }

        function createFilterFor(query) {
            var lowercaseQuery = query.toLowerCase();
            //query.charAt(0).toUpperCase() + query.slice(1);
            return function filterFn(obj) {
                return (obj.primary_cat.indexOf(lowercaseQuery) != -1);
            };
        }

        function searchTextChange(text) {
            console.log('Text changed to ', text);

        }

        function selectedItemChange(item) {
            console.log('item', item);
            // selected material;

        }

        $scope.showDelete = function (ev, id) {
            console.log('CLICK');
            var confirm = $mdDialog.confirm()
                .title('Are you sure you want to delete this item?')
                .content('This will be permanent.')
                .ariaLabel('Delete item permanently')
                .ok('Delete')
                .cancel('Cancel')
                .targetEvent(ev);
            $mdDialog.show(confirm).then(function () {
                console.log("Deleting", id);
                self.deleteProjectItem(id);
                $scope.alert = 'Your item has been deleted.';
            }, function () {
                $scope.alert = 'Your item has not been deleted.';
            });
        };


        function deleteProjectItem(item) {
            $http.delete('/project/calculation/' + item.id).then(function () {
                projectMethods.getProjectItems(function (items) {
                    self.projectItems = items;
                })
            })

        }


        function calculateProjectTotal() {
            console.log("calculating...");
            projectTotal = 0;
            self.projectItems.forEach(function (item) {
                projectTotal += item.co2_offset;
                console.log(projectTotal);
            });
            console.log(projectTotal);
            self.projectTotal = Math.floor(projectTotal * 100) / 100;
        }

        function downloadProject() {
            var csvContent = "data:text/csv;charset=utf-8,";

            var dataString = 'category,sub_category,units,weight,item_description\n';
            self.projectItems.forEach(function (item, index) {
                dataString += item.category + ',' + item.sub_category + ',' + item.units + ',' + item.weight + ','
                    + item.item_description + '\n'
            });

            // enable to download
            //csvContent += dataString;
            //var encodedUri = encodeURI(csvContent);
            //var link = document.createElement("a");
            //link.setAttribute("href", encodedUri);
            //link.setAttribute("download", "my_data.csv");
            //
            //link.click(); // This will download the data file named "my_data.csv".

        }


    }]);
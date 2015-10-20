app.factory('calculator', ['$http', function($http){

    var materialsList;
    var units = [
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

    function getUnits(){
        return units;
    }

    function getMaterials(){
        return $http.get('/materials').then(function(response) {
            var list = response.data;

            list.forEach(function(item){
                item.primary_cat = item.primary_cat.toLowerCase();
                // /item.primary_cat = item.primary_cat.charAt(0).toUpperCase() + item.primary_cat.slice(1).toLowerCase();

            });

            materialsList = list;
            return list;

        });
    }

    return {
        getMaterials: getMaterials,
        getUnits: getUnits,

    }
}]);
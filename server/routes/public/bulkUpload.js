const
    express = require('express'),
    router = express.Router();
    pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ecotone';


    //SELECT co2 FROM proxies
    //    JOIN secondaries ON secondaries.warm_id = proxies.id
    //    JOIN primaries ON primaries.id = secondaries.primary_id
    //        WHERE upper(primaries.primary_cat) = upper('bench')
    //            AND upper(secondaries.secondary_cat) = upper('wood')


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

/**
 * Helper function called in bulk upload for each (i.e. on rows of csv)
 * @param primary_cat -- column one in the csv
 * @param secondary_cat -- column two in the csv
 * @param arr -- database info (the join)
 * @returns {*}
 */
function findCO2( primary_cat, secondary_cat, arr){
    // coerce to lowercase for comparison
    var primary = primary_cat.toLowerCase();

    // can't convert null to lowercase
    if( secondary_cat != null ){
        var secondary = secondary_cat.toLowerCase();
    }

    // filter the array to find the c02 value per primary and secondary cat provided in csv
    var row = arr.filter(function( row ){
        // if secondary cat provided
        if(row.secondary_cat != null) {
            return (row.primary_cat.toLowerCase() == primary && row.secondary_cat.toLowerCase() == secondary)
        // else just check for primary cat (i.e. direct mapping to warm cat)
        } else {
            return (row.primary_cat.toLowerCase() == primary )
        }
    });

    // error handling (should not happen if csv uploaded correctly)
    if(row != undefined ){
        console.log(row[0]);
        return row[0].co2
    } else {
        return 'err'
    }

}

router.post('/', function(req, res){

    // get the join from the database
    pg.connect( connectionString , function( err, client , done){
        if( err ){
            console.log(err);
        } else {
            // full table join with only categories and co2 values listed
            client.query('select primary_cat, secondary_cat, co2 from proxies join secondaries on secondaries.warm_id = proxies.id join primaries on primaries.id = secondaries.primary_id', function(err, results){

                if(results){

                    // CSV arr from req body
                    var bulkArr = req.body;
                    // for each csv row
                    bulkArr.forEach(function(item){
 //                       console.log(' for each ', item.category, item.sub_category);

                        // find the co2 coefficient using function defined above
                        var co2Coef = parseFloat(findCO2( item.category, item.sub_category, results.rows));

                        // get the units from the units conversion object
                        var unit = units.filter(function( unit ){ return unit.name == item.units });

                        // get the conversion factor
                        var unitCoef = unit[0].conversion;
                        //console.log(co2Coef, unitCoef, item.weight);
                        // calc and assign new property to row
                        item.co2_offset =  Math.abs(unitCoef * parseFloat(item.weight) * co2Coef);
                    });


                    /**
                     *
                     *
                     *
                     * DO SOMETHING HERE WITH RESULTS
                     *      PUSH TO DB PROBS AND SEND BACK RESULTS TO BE DISPLAYED
                     *
                     */
                    res.send(bulkArr);
                } else{
                    res.send("Cannot find that proxy");
                }
            });
            done();
        }
    });


});

module.exports = router;

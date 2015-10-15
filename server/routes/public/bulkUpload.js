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


function findCO2( primary_cat, secondary_cat, arr){
    var primary = primary_cat.toLowerCase();
    if( secondary_cat != null ){
        var secondary = secondary_cat.toLowerCase();
    }

    var row = arr.filter(function( row ){
        if(row.secondary_cat != null) {
            return (row.primary_cat.toLowerCase() == primary && row.secondary_cat.toLowerCase() == secondary)
        } else {
            return (row.primary_cat.toLowerCase() == primary )
        }
    });

    if(row != undefined ){
        return row[0].co2
    } else {
        return 'err'
    }

}

router.post('/', function(req, res){

    pg.connect( connectionString , function( err, client , done){
        if( err ){
            console.log(err);
        } else {
            client.query('select primary_cat, secondary_cat, co2 from proxies join secondaries on secondaries.warm_id = proxies.id join primaries on primaries.id = secondaries.primary_id', function(err, results){

                if(results){
                    var bulkArr = req.body;
                    bulkArr.forEach(function(item){
                        item.co2 = findCO2( item.category, item.subcategory, results.rows);
                        console.log(item.co2);
                    });

                    res.sendStatus(200);
                } else{
                    res.send("Cannot find that proxy");
                }
            });
            done();
        }
    });


});

module.exports = router;
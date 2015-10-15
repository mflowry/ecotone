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

router.post('/', function(req, res){
    pg.connect( connectionString , function( err, client , done){
        if( err ){
            console.log(err);
        } else {
            console.log(warmID);
            client.query('select primary_cat, secondary_cat, co2 from proxies join secondaries on secondaries.warm_id = proxies.id join primaries on primaries.id = secondaries.primary_id', [category, subcategory], function(err, results){

                console.log(results);
                if(results){
                    console.log(results);
                    res.sendStatus(200)
                } else{
                    res.send("Cannot find that proxy");
                }
            });
            done();
        }
    });


});

module.exports = router;
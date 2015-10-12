const
    express = require('express'),
    router = express.Router(),
    pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ecotone';

const client = new pg.Client(connectionString);
client.connect();

function warmCalculation(warmID,weight,res){
    var calculation;
    pg.connect( connectionString , function( err, client , done){
        if( err ){
            console.log(err);
        } else {
            console.log(warmID);
            client.query('select co2 from proxies where id=$1', [warmID], function(err, results){
                console.log(results);
                if(results){
                    calculation = parseFloat(results.rows[0].co2)*weight;
                    res.json(calculation);
                } else{
                    res.send("Cannot find that proxy");
                }
            });
            done();
        }
    });
}

router.post('/', function(req, res, next){

    var warmID = req.body.warmId;
    var weight = parseFloat(req.body.weight);
    warmCalculation(warmID, weight, res);
});

module.exports = router;

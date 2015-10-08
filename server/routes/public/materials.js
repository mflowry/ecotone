const
    express = require('express'),
    router = express.Router(),
    pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ecotone';

const client = new pg.Client(connectionString);
client.connect();

function createProxy(req, res, next){
    var data = {name: req.body.name};
    console.log(data.name);
    pg.connect( connectionString , function( err, client , done){
        if( err ){
            console.log(err);
        } else {
            client.query('INSERT INTO proxies VALUES($1)', [data.name]);
            done();
            res.send(200);
        }
    });
}

router.post('/createProxy', function(req, res, next){
    createProxy(req, res, next);
});

router.get('/', function( req, res, next ){
    pg.connect( connectionString , function( err, client, done ) {
        if (err) console.log(err);

        client.query('SELECT primary_cat FROM primaries ',
            function( err, results){
                done();
                console.log(results);
                res.send(results);
            })
    });
});

module.exports = router;
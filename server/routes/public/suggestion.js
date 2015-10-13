const
    express = require('express'),
    router = express.Router(),
    pg = require('pg');

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ecotone';

const client = new pg.Client(connectionString);
client.connect();

router.post('/', function( req, res, next ){
    var data = req.body;
    pg.connect( connectionString , function( err, client , done){
        if( err ){
            console.log(err);
        } else {
            client.query('INSERT INTO suggestions(email, material, notes) VALUES($1, $2, $3)', [data.email, data.material, data.notes]);
            done();
            res.send(200);
        }
    });
});

router.get('/', function( req, res, next){
    var suggestions = [];

    pg.connect( connectionString , function( err, client, done ) {
        if (err) console.log(err);

        client.query('select * from suggestions',
            function( err, results){
                done();
                suggestions = results.rows;
                client.query('select * from secondaries', function ( err, results ){
                    res.send(suggestions);
                });
            })
    });});

module.exports = router;
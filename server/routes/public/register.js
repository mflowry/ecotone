const express = require('express'),
router = express.Router(),
pg = require('pg');

//var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ecotone';

//const client = new pg.Client(connectionString);
//client.connect();

var Users = require('../../models/users');
//console.log('test');
//function createUser(req, res, next){
//  var userData = {
//    username: req.body.name,
//    password: req.body.password,
//    email: req.body.email,
//    firstName: req.body.firstName,
//    lastName: req.body.lastName,
//    title: req.body.title,
//    companyName: req.body.companyName,
//    zipCode: req.body.zipCode
//  };

//  pg.connect( connectionString , function( err, client , done){
//    if( err ){
//      console.log(err);
//    } else {
//      client.query('INSERT INTO users VALUES($1,$2,$3,$4,$5,$6,$7,$8)', [
//        userData.name,userData.password,userData.email,userData.firstName,userData.lastName,userData.title,userData.companyName,userData.zipCode]);
//      done();
//      res.send(200);
//    }
//  });
//}

router.get('/',function(req,res,next){
    res.sendStatus(200);
});

router.post('/', function(req, res, next) {
  //var user = new Users(req.body);
    var options = {
        where: {
            email: req.body.email
        },
        defaults: req.body
    };
    Users.sync().then(function(){
        Users.findOrCreate(options)
            .then(function (user) {
                //console.log(user);
                res.sendStatus(200);
            }).catch(function (err) {
                console.log('there was an error', err);
                res.send('error!',err);
            });
    });
    //    Users.sync().then(function () {
    //
    //        Users.findOrCreate(options)
    //        .spread(function(user){
    //            console.log(user);
    //            res.sendStatus(200);
    //        }).error(function(err){
    //                console.log(err);
    //            });
    //});
});

module.exports = router;

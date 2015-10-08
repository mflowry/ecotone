const express = require('express'),
router = express.Router(),
pg = require('pg'),
expressJwt = require('express-jwt');

var Users = require('../../models/users');

router.use(expressJwt({secret: 'supersecret'}));

router.get('/',function(req,res,next){
    res.sendStatus(200);
});

router.put('/', function(req, res, next) {
  //var user = new Users(req.body);
    var options = {
        where: {
            username: req.body.username
        }
    };

    Users.update(req.body,options)
        .then(function (user) {
            //console.log(user);
            res.sendStatus(200);
        }).catch(function (err) {
            console.log('there was an error', err);
            res.send('error!',err);
        });
});

router.delete('/:id', function(req, res, next) {
    //var user = new Users(req.body);
    var options = {
        where: {
            id: req.params.id
        },
        limit: 1,
        truncate: false
    };

    Users.destroy(options)
        .then(function (user) {
            //console.log(user);
            res.sendStatus(200);
        }).catch(function (err) {
            console.log('there was an error', err);
            res.send('error!',err);
        });
});

module.exports = router;

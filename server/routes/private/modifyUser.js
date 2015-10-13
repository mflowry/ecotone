const
    express = require('express'),
    router = express.Router(),
    expressJwt = require('express-jwt');

var Users = require('../../models/models').Users;

router.use(expressJwt({secret: 'supersecret'}));

router.get('/',function(req,res,next){
    res.sendStatus(200);
});

router.put('/', function(req, res, next) {

    var existingUserByUsername = {
        where: {
            username: req.body.username
        }
    };

    Users.update(req.body, existingUserByUsername)
        .then(function (user) {
            //console.log(user);
            res.sendStatus(200);
        }).catch(function (err) {
            console.log('there was an error', err);
            res.send('error!',err);
        });
});

router.delete('/:id', function(req, res, next) {

    // set query data to find user by id
    var existingUserById = {
        where: {
            id: req.params.id
        },

        // ensures only one user is found as fallback
        limit: 1,
        truncate: false
    };

    Users.destroy(existingUserById)
        .then(function (user) {
            //console.log(user);
            res.sendStatus(200);
        }).catch(function (err) {
            console.log('there was an error', err);
            res.send('error: ',err);
        });
});

module.exports = router;

const
    express = require('express'),
    router = express.Router(),
    Users = require('../../models/users');

router.post('/', function(req, res, next) {

        var existingUserByEmail = {
            where: {
                email: req.body.email
            }
        };

        Users.sync().then(function () {
            Users.find(existingUserByEmail).then(function(user){

                // if returned user is null (does not exist)
                if( user === null ) {

                    // create a new user using the values in the request body
                    Users.create(req.body)
                        .then(function (user) {

                            // set the response user object's hashed pass to null
                            user.dataValues.password = null;

                            // send the relevant part of the user object to client
                            res.send(user.dataValues);

                        }).catch(function (err) {
                            console.log('there was an error', err);
                            res.send('error: ', err);
                        });
                } else {

                    // if user already exists, send status 409
                    res.sendStatus(409);
                }
            }).catch(function( err ){

                // status should only occur if there is an error internal to the database
                res.sendStatus(500)
            });
        })
});

module.exports = router;

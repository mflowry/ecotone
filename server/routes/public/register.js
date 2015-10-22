const
    express = require('express'),
    router = express.Router(),
    Users = require('../../models/models').Users;

router.post('/', function(req, res, next) {

    req.checkBody('email','Not a valid email').notEmpty().isEmail();
    req.checkBody('username','Not a valid username').notEmpty().isAlphanumeric();

    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.status(409).send({message: errors[0].msg});
    }else{
        var existingUserByEmail = {
            where: {
                $or: [
                    {username: req.body.username},
                    {email: req.body.email}
                ]
            }
        };

        //Users.sync().then(function () {
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
                console.log(user.email);
                // if user already exists, send status 409
                if(user.email == req.body.email){
                    res.status(409).send({message: 'That email has already been registered!'});
                } else{
                    res.status(409).send({message: 'That username is already taken!'});
                }
            }
        }).catch(function( err ){

            // status should only occur if there is an error internal to the database
            res.status(500).send({message: 'There was an internal server error, please try again later.'});
        });

    }

});

module.exports = router;

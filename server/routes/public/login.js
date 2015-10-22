const
    express = require('express'),
    router = express.Router();

var Users = require('../../models/models').Users;

router.post('/', function(req, res, next) {

    req.checkBody('email','Not a valid email').notEmpty().isEmail();

    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.status(409).send({message: errors[0].msg});
    } else{
        Users.getAuthenticated(req.body, function (err, token, user) {
            if (err) {
                console.log('ERROR',err.message);
                res.status(400).send({message: err.message});
            } else {
                res.send({token: token, user: user});
            }
        });
    }
});

module.exports = router;

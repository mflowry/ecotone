const
    express = require('express'),
    router = express.Router(),
    moment = require('moment');

var Users = require('../../models/models').Users;

router.get('/:token', function(req, res) {
    var findUserByToken = {
        where: {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: {$gt: moment(Date.now()).format()}
        },
        // ensures only one user is found as fallback
        limit: 1
    };

    Users.find(findUserByToken)
        .then(function(user) {
            if (user===null) {
                throw new Error('Password reset token is invalid or has expired.');
            } else{
                res.redirect('/reset');
            }

        }).catch(function(err){
            res.render('error', {message: err.message});
        });


});

module.exports = router;

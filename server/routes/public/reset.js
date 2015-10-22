const
    express = require('express'),
    router = express.Router(),
    moment = require('moment'),
    async = require('async'),
    nodemailer = require('nodemailer');

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
                res.redirect('/#/reset/' + req.params.token);

            }

        }).catch(function(err){
            console.log(err);
            res.render('error', {message: err.message});
        });

});

router.post('/:token', function(req, res, next) {
    async.waterfall([
        function(done) {
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
                    if (user!==null){
                        user.password = req.body.password;
                        user.resetPasswordToken = null;
                        user.resetPasswordExpires = null;

                        user.save()
                            .then(function(user){
                                done(null, token, user);
                            })
                            .catch(function(err){
                                console.log(err);
                                done(err);
                            });
                    }

                }).catch(function(err){
                    res.send({message: err});
                });

        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport('SMTP', {
                service: 'mailgun',
                auth: {
                    api_key: 'key-29ab2a0ca6dedaa06bd1f7aee276391f',
                    user: 'postmaster@sandboxcfba68f48e7043be83a68b6df8491c52.mailgun.org',
                    pass: '9f1c5990577e11fc09e9acb72bd75a41'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'PasswordReset@ecotone-partners.com',
                subject: 'Your password has been changed',
                text: 'This is a confirmation that the password for your account ' + user.email + ' has been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                res.send({message: 'Your password has been changed.'});
                console.log(err);
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
    });
});

router.post('/:token', function(req, res, next) {
    async.waterfall([
        function(done) {
            var findUserByToken = {
                where: {
                    resetPasswordToken: req.params.token,
                    resetPasswordExpires: {$gt: moment(Date.now()).format()}
                },
                // ensures only one user is found as fallback
                limit: 1
            };

            var updatedUser = {
                password: req.body.password,
                resetPasswordToken: null,
                resetPasswordExpires: null
            };

            Users.update(updatedUser,findUserByToken)
                .then(function(user) {

                    res.sendStatus(200);

                }).catch(function(err){
                    res.send({message: err});
                });

        },
        function(user, done) {
            var smtpTransport = nodemailer.createTransport('SMTP', {
                service: 'mailgun',
                auth: {
                    api_key: 'key-29ab2a0ca6dedaa06bd1f7aee276391f',
                    user: 'postmaster@sandboxcfba68f48e7043be83a68b6df8491c52.mailgun.org',
                    pass: '9f1c5990577e11fc09e9acb72bd75a41'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'PasswordReset@ecotone-partners.com',
                subject: 'Your password has been changed',
                text: 'This is a confirmation that the password for your account with the username ' + user.username + ' has been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function(err) {
                res.send({message: 'Your password has been changed.'});
                console.log(err);
                done(err, 'done');
            });
        }
    ], function(err) {
        if (err) return next(err);
    });
});

module.exports = router;

const
    express = require('express'),
    router = express.Router(),
    expressJwt = require('express-jwt'),
    async = require('async'),
    pg = require('pg');

var Projects = require('../../models/models').Projects,
    Users = require('../../models/models').Users,
    Calculations = require('../../models/models').Calculations,
    connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ecotone';

router.use(expressJwt({secret: process.env.jwtSecret || 'supersecret'}));

const client = new pg.Client(connectionString);
client.connect();

//return all calculations for a given user
function getProjectsByUserId(req, res) {
    var userId = req.query.user_id;
    pg.connect(connectionString, function (err, client, done) {
        if (err) {
            console.log(err);
        } else {
            client.query('select * from projects inner join calculations on (projects.id = calculations.project_id) where user_id=$1 and projects.active=true and calculations.active=true', [userId], function (err, results) {
                done();
                if (err) {
                    console.log(err);
                } else {
                    // console.log(results);
                }
                //var projects = results.rows;
                console.log('ABOUT TO SEND');
                res.send(results.rows);
            });


        }
    });
}

function getProjectNamesByUserId(req, res, next) {
    var userId = req.query.user_id;
    //console.log(userId);
    pg.connect(connectionString, function (err, client, done) {
        if (err) {
            console.log(err);
        } else {
            client.query('select * from projects  where projects.user_id=$1 and projects.active=true ', [userId], function (err, results) {
                done();
                if (err) {
                    console.log(err);
                } else {
                    // console.log(results);
                }
                //var projects = results.rows;
                console.log('ABOUT TO SEND');
                res.send(results.rows);

            });
        }
    });
}

//get calculations for given user and project
function getProjectsByProjectId(req, res) {
    var userId = req.query.user_id,
        projectId = req.query.project_id;
    pg.connect(connectionString, function (err, client, done) {
        if (err) {
            console.log(err);
        } else {
            client.query('select * from projects inner join calculations on (projects.id = calculations.project_id) where projects.id=$1 and user_id=$2 and projects.active=true and calculations.active=true', [projectId, userId], function (err, results) {
                done();
                if (err) {
                    console.log(err);
                } else {
                    res.send(results.rows);
                }
            });
        }
    });
}

router.get('/', function (req, res, next) {


    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.status(409).send({message: errors[0].msg});
    } else {
        if (req.query.user_id && req.query.project_id) {
            req.checkQuery('project_id', 'Invalid id').isInt();
            req.checkQuery('user_id', 'Invalid id').isInt();
            getProjectsByProjectId(req, res);
        } else if (req.query.user_id) {
            req.checkQuery('user_id', 'Invalid id').isInt();
            getProjectsByUserId(req, res);
        } else {
            res.status(400).send({message: "You must specify a user id or a user id and a project id"})
        }
    }
});

router.get('/namesById', function (req, res, next) {

    req.checkQuery('user_id', 'Invalid id').isInt();

    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.status(409).send({message: errors[0].msg});
    } else {
        if (req.query.user_id) {
            getProjectNamesByUserId(req, res, next);
        } else {
            res.status(400).send('You must specify a user id');
        }
    }

});


router.post('/', function (req, res, next) {

    req.checkBody('user_id', 'Invalid id').isInt();

    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.status(409).send({message: errors[0].msg});
    } else {
        Users.findById(req.body.user_id)
            .then(function (user) {

                var existingProjectId = {
                    where: {
                        project_name: req.body.project_name,
                        user_id: req.body.user_id,
                        active: true
                    },
                    defaults: req.body
                };
                console.log(req.body);
                //find an existing project or create a new one
                return Projects.findOrCreate(existingProjectId)
                    .spread(function (project, created) {
                        if (created) {
                            //create a new project and associate it with the user
                            return user.addProject(project)
                                .then(function () {
                                    //add the user_id field to the returned project
                                    project.dataValues.user_id = user.id;
                                    res.send(project.dataValues);
                                })
                        } else {
                            //if existing project, send an error
                            throw new Error('Duplicate Project Name');
                        }
                    });
            }).catch(function (err) {
                //if error is due to duplicate project name, send custom status
                if (err.message === 'Duplicate Project Name') {
                    res.status(409).send({message: err.message});
                }
                else {
                    res.send(err);
                }
            });
    }
    //find user to associate project with

});

//update projects
router.put('/', function (req, res, next) {

    req.checkBody('project_id', 'Invalid id').isInt();

    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.status(409).send({message: errors[0].msg});
    } else {
        var existingProjectById = {
            where: {
                id: req.body.project_id
            }
        };

        Projects.update(req.body, existingProjectById)
            .then(function (project) {
                console.log(project);
                res.status(200).send({message: 'Updated Project.'});
            }).catch(function (err) {
                console.log('there was an error', err);
                res.send({message: err});
            });
    }

});

router.delete('/:id', function (req, res, next) {

    req.checkParams('id', 'Invalid id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.status(409).send({message: errors[0].msg});
    } else {
        var existingProjectById = {
            where: {
                id: req.params.id
            },

            // ensures only one project is found as fallback
            limit: 1,
            truncate: false
        };

        //sets active field to false, doesn't actually remove project from database
        Projects.update({active: false}, existingProjectById)
            .then(function () {
                res.sendStatus(200);
            }).catch(function (err) {
                console.log('there was an error', err);
                res.send({message: err});
            });
    }
});

//add a new calculation
router.post('/calculation', function (req, res, next) {

    req.checkBody('project_id', 'Invalid id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.status(409).send({message: errors[0].msg});
    } else {
        //find project to associate calculation with
        Projects.findById(req.body.project_id)
            .then(function (project) {

                //allow for bulk calculation creation

                //create calculation
                return Calculations.create(req.body)
                    .then(function (calculation) {

                        // associate the calculation with the current project
                        project.addCalculation(calculation).then(function () {
                            res.sendStatus(200);
                        });
                        //}).catch(function ( err ) {
                        //    res.send({message: err})
                        //})

                        //}).catch(function (err) {
                        //    console.log('there was an error', err);
                        //res.send('error: ', err);
                    });

            })
            .catch(function (err) {
                res.send({message: err});
            });
    }
});

router.post('/csvUpload', function (req, res, next) {
   console.log(req.body);
    req.checkBody('project_id', 'Invalid id').isInt();
    var calculations = req.body.calculations;
    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        return res.status(409).send({message: errors[0].msg});
    } else {
        //find project to associate calculation with
        Projects.findById(req.body.project_id)
            .then(function (project) {
                //create bulk calculation, use next tick to avoid clogging the stack
                process.nextTick(function(){
                    //create each calculation row
                    async.each(calculations, function (calc, done) {
                        Calculations.create(calc)
                            .then(function (calculation) {
                                //associate calculations with the project
                                project.addCalculation(calculation)
                                    .then(function () {
                                        done();
                                    }).catch(function (err) {
                                        done(err);
                                    });
                            }).catch(function (err) {
                                done(err);
                            });
                    }, function (err) {
                        if (err) {
                            return next(new Error(err));
                        } else {
                            return res.sendStatus(200);
                        }
                    });
                });
            })
            .catch(function (err) {
                return next(new Error(err));
            });
    }
});


router.delete('/calculation/:id', function (req, res, next) {

    req.checkParams('id', 'Invalid id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.status(409).send({message: errors[0].msg});
    } else {
        // set query data to find project by id
        var existingCalculationById = {
            where: {
                id: req.params.id
            },

            // ensures only one project is found as fallback
            limit: 1,
            truncate: false
        };

        //sets active field to false, doesn't actually remove project from database
        Calculations.update({active: false}, existingCalculationById)
            .then(function () {
                res.sendStatus(200);
            }).catch(function (err) {
                console.log('there was an error', err);
                res.send({message: err});
            });
    }
});

//update calculations
router.put('/calculation', function (req, res, next) {

    req.checkBody('calculation_id', 'Invalid id').notEmpty().isInt();

    var errors = req.validationErrors();
    if (errors) {
        console.log(errors);
        res.status(409).send({message: errors[0].msg});
    } else {
        var existingCalculationById = {
            where: {
                id: req.body.calculation_id
            }
        };

        Calculations.update(req.body, existingCalculationById)
            .then(function () {
                res.status(200).send("Updated calculation.");

            }).catch(function (err) {
                console.log('there was an error', err);
                res.send('error: ', err);
            });
    }
});

module.exports = router;

const
    express = require('express'),
    router = express.Router(),
    expressJwt = require('express-jwt'),
    pg = require('pg');

var Projects = require('../../models/models').Projects;
var Users = require('../../models/models').Users;
var Calculations = require('../../models/models').Calculations;

router.use(expressJwt({secret: 'supersecret'}));

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ecotone';

const client = new pg.Client(connectionString);
client.connect();

function getProjectsByUserId(req, res, next){
    var userId = req.query.user_id;
    //console.log(userId);
    pg.connect( connectionString , function( err, client , done){
        if( err ){
            console.log(err);
        } else {
            client.query('select * from projects inner join calculations on (projects.id = calculations.project_id) where user_id=$1', [userId],function(err,results){
                done();
                if(err){
                    console.log(err);
                } else{
                    console.log(results);
                }
                //var projects = results.rows;
                res.send(results.rows);
            });


        }
    });
}

function getProjectsByProjectId(req, res, next){
    var userId = req.query.user_id,
        projectId = req.query.project_id;
    //console.log(userId);
    pg.connect( connectionString , function( err, client , done){
        if( err ){
            console.log(err);
        } else {
            client.query('select * from projects inner join calculations on (projects.id = calculations.project_id) where projects.id=$1 and user_id=$2', [projectId,userId],function(err,results){
                done();
                if(err){
                    console.log(err);
                } else{
                    res.send(results.rows);
                }

            });


        }
    });
}

router.get('/', function(req,res,next){
        if(req.query.user_id && req.query.project_id){
            getProjectsByProjectId(req,res,next);
        } else if(req.query.user_id){
            getProjectsByUserId(req,res,next);
        } else{
            res.status(400).send("You must specify a user id or a user id and a project id")
        }
        //getProjectsByUserId(req,res,next);
});

router.post('/', function (req, res, next) {

    Users.findById(req.body.user_id)
        .then(function (user) {

            var existingProjectId = {
                where: {
                    project_name: req.body.project_name,
                    user_id: req.body.user_id
                },
                defaults: req.body
            };
            return Projects.findOrCreate(existingProjectId)
                .spread(function (project, created){
                    if(created){
                        return user.addProject(project)
                            .then(function(){
                                project.dataValues.user_id = user.id;
                                res.send(project.dataValues);
                            })
                    } else {
                        throw new Error('Duplicate Project Name');
                    }
                });
        //
        //
        ////console.log(req.body);
        //
        //    Projects.findOrCreate(existingProjectId)
        //        .spread(function (project, created) {
        //
        //        // if returned project is null (does not exist)
        //        if (project === null) {
        //
        //            // create a new project using the values in the request body
        //            return Projects.create(req.body)
        //                .then(function (project) {
        //
        //                    // add the project to the user
        //                    user.addProject(project).then(function(){
        //
        //
        //                        project.dataValues.user_id = user.id;
        //                        // send the relevant part of the project object to client
        //                        res.send(project);
        //
        //                    });
        //
        //                }).catch(function (err) {
        //                    res.send('error: ', err);
        //                });
        //        } else {
        //
        //            // if project already exists, send status 409
        //            res.sendStatus(409).send({message: "Duplicate project name"});
        //        }
            }).catch(function (err) {

                if (err.message === 'Duplicate Project Name'){
                    res.sendStatus(409).send({message:err.message});
                }
                res.send(err);
                // status should only occur if there is an error internal to the database
                //res.sendStatus(409).send({message: "Duplicate project name"});

            });
        //})
    });

router.put('/', function (req, res, next) {

    var existingProjectById = {
        where: {
            id: req.body.project_id
        }
    };

    Projects.update(req.body, existingProjectById)
        .then(function (project) {
            //console.log(project);
            res.sendStatus(200);
        }).catch(function (err) {
            console.log('there was an error', err);
            res.send('error!', err);
        });
});

router.delete('/:id', function (req, res, next) {

    // set query data to find project by id
    var existingProjectById = {
        where: {
            id: req.params.id
        },

        // ensures only one project is found as fallback
        limit: 1,
        truncate: false
    };

    Projects.destroy(existingProjectById)
        .then(function (project) {
            //console.log(project);
            res.sendStatus(200);
        }).catch(function (err) {
            console.log('there was an error', err);
            res.send('error: ', err);
        });
});

router.post('/calculation', function (req, res, next) {

    Projects.findById(req.body[0].project_id).then(function (project) {
        var returnedCalculations = [];
        req.body.forEach(function(item){

            Calculations.create(
                item)
                .then(function (calculation) {

                    // add the project to the user
                    project.addCalculation(calculation).then(function(){


                        calculation.dataValues.project_id = project.project_id;
                        // send the relevant part of the project object to client
                        returnedCalculations.push(calculation.dataValues);
                        //console.log(calculation);
                    });

                }).catch(function (err) {
                    console.log('there was an error', err);
                    res.send('error: ', err);
                });
        });
        console.log(returnedCalculations);
        res.send(returnedCalculations);

    })

});

router.delete('/calculations/:id', function (req, res, next) {

    // set query data to find project by id
    var existingCalculationById = {
        where: {
            id: req.params.id
        },

        // ensures only one project is found as fallback
        limit: 1,
        truncate: false
    };

    Projects.destroy(existingCalculationById)
        .then(function (caclulation) {
            //console.log(project);
            res.sendStatus(200);
        }).catch(function (err) {
            console.log('there was an error', err);
            res.send('error: ', err);
        });
});

router.put('/calculation', function (req, res, next) {

    var existingCalculationById = {
        where: {
            id: req.body.calculation_id
        }
    };

    Projects.update(req.body, existingCalculationById)
        .then(function (calculation) {
            //console.log(calculation);
            res.sendStatus(200);
        }).catch(function (err) {
            console.log('there was an error', err);
            res.send('error!', err);
        });
});

module.exports = router;

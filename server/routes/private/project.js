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
            client.query('select * from projects inner join calculations on (projects.id = calculations.project_id) where user_id=$1 and projects.active=true and calculations.active=true', [userId],function(err,results){
                done();
                if(err){
                    console.log(err);
                } else{
                    //console.log(results);
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
            client.query('select * from projects inner join calculations on (projects.id = calculations.project_id) where projects.id=$1 and user_id=$2 and projects.active=true and calculations.active=true', [projectId,userId],function(err,results){
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
            }).catch(function (err) {

                if (err.message === 'Duplicate Project Name'){
                    res.status(409).send({message:err.message});
                }
                else{
                    res.send(err);
                }
        });
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

    Projects.update({active:false},existingProjectById)
        .then(function (project) {
            //console.log(project);
            res.sendStatus(200);
        }).catch(function (err) {
            console.log('there was an error', err);
            res.send('error: ', err);
        });
});

router.post('/calculation', function (req, res, next) {

    Projects.findById(req.body[0].project_id)
        .then(function (project) {

            req.body.forEach( function(item){

                Calculations.create(item)
                    .then(function (calculation) {

                        // add the project to the user
                        project.addCalculation(calculation).then(function(){
                        });

                    }).catch(function (err) {
                        console.log('there was an error', err);
                        //res.send('error: ', err);
                    });
            });

            //console.log(returnedCalculations);
            res.sendStatus(200);

        })
        .catch(function (err) {
            res.send(err);
        });

});

router.delete('/calculation/:id', function (req, res, next) {

    // set query data to find project by id
    var existingCalculationById = {
        where: {
            id: req.params.id
        },

        // ensures only one project is found as fallback
        limit: 1,
        truncate: false
    };

    Calculations.update({active: false},existingCalculationById)
        .then(function (calculation) {
            //console.log(project);
            res.sendStatus(200);
        }).catch(function (err) {
            console.log('there was an error', err);
            res.send('error: ', err);
        });
});

router.put('/calculation', function (req, res, next) {

    Projects.findById(req.body.project_id)
        .then(function (project) {

            var existingCalculationByProjectId = {
                where: {
                    project_id: project.id
                }
            };
            console.log('found project', project.id);

            Calculations.update(existingCalculationByProjectId)
                    .then(function (affectedRows) {
                        //// add the project to the user
                        //Calculations.find.addCalculation(calculation).then(function(){
                        //
                        //});
                        res.status(200).send("Updated " + affectedRows + " calculations");

                    }).catch(function (err) {
                        console.log('there was an error', err);
                        res.send('error: ', err);
                    });
            })
        .catch(function (err) {
            res.send(err);
        });
});

module.exports = router;

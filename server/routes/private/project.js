const
    express = require('express'),
    router = express.Router(),
    expressJwt = require('express-jwt'),
    pg = require('pg');

var Projects = require('../../models/models').Projects,
    Users = require('../../models/models').Users,
    Calculations = require('../../models/models').Calculations,
    connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ecotone';

router.use(expressJwt({secret: 'supersecret'}));

const client = new pg.Client(connectionString);
client.connect();

//return all calculations for a given user
function getProjectsByUserId(req, res){
    var userId = req.query.user_id;
    pg.connect( connectionString , function( err, client , done){
        if( err ){
            console.log(err);
        } else {
            client.query('select * from projects inner join calculations on (projects.id = calculations.project_id) where user_id=$1 and projects.active=true and calculations.active=true', [userId],function(err,results){
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

//get calculations for given user and project
function getProjectsByProjectId(req, res){
    var userId = req.query.user_id,
        projectId = req.query.project_id;
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
            getProjectsByProjectId(req,res);
        } else if(req.query.user_id){
            getProjectsByUserId(req,res);
        } else{
            res.status(400).send({message:"You must specify a user id or a user id and a project id"})
        }
});

//add a new project
router.post('/', function (req, res, next) {
    //find user to associate project with
    Users.findById(req.body.user_id)
        .then(function (user) {

            var existingProjectId = {
                where: {
                    project_name: req.body.project_name,
                    user_id: req.body.user_id
                },
                defaults: req.body
            };

            //find an existing project or create a new one
            return Projects.findOrCreate(existingProjectId)
                .spread(function (project, created){
                    if(created){
                        //create a new project and associate it with the user
                        return user.addProject(project)
                            .then(function(){
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
                if (err.message === 'Duplicate Project Name'){
                    res.status(409).send({message:err.message});
                }
                else{
                    res.send(err);
                }
        });
});

//update projects
router.put('/', function (req, res, next) {

    var existingProjectById = {
        where: {
            id: req.body.project_id
        }
    };

    Projects.update(req.body, existingProjectById)
        .then(function () {
            res.status(200).send('Updated Project.');
        }).catch(function (err) {
            console.log('there was an error', err);
            res.send({message: err});
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

    //sets active field to false, doesn't actually remove project from database
    Projects.update({active:false},existingProjectById)
        .then(function () {
            res.sendStatus(200);
        }).catch(function (err) {
            console.log('there was an error', err);
            res.send({message: err});
        });
});

//add a new calculation
router.post('/calculation', function (req, res, next) {

    //find project to associate calculation with
    Projects.findById(req.body[0].project_id)
        .then(function (project) {

            //allow for bulk calculation creation
            req.body.forEach( function(item){

                //create calculation
                Calculations.create(item)
                    .then(function (calculation) {

                        // associate the calculation with the current project
                        project.addCalculation(calculation).then(function(){
                        });

                    }).catch(function (err) {
                        console.log('there was an error', err);
                        //res.send('error: ', err);
                    });
            });

            res.sendStatus(200);

        })
        .catch(function (err) {
            res.send({message: err});
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

    //sets active field to false, doesn't actually remove project from database
    Calculations.update({active: false},existingCalculationById)
        .then(function () {
            res.sendStatus(200);
        }).catch(function (err) {
            console.log('there was an error', err);
            res.send({message: err});
        });
});

//update calculations
router.put('/calculation', function (req, res, next) {

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
});

module.exports = router;

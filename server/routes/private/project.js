const
    express = require('express'),
    router = express.Router(),
    expressJwt = require('express-jwt'),
    pg = require('pg');

var Projects = require('../../models/models').Projects;
var Users = require('../../models/models').Users;
var Calculations = require('../../models/models').Calculations;

//router.use(expressJwt({secret: 'supersecret'}));

var connectionString = process.env.DATABASE_URL || 'postgres://localhost:5432/ecotone';

const client = new pg.Client(connectionString);
client.connect();

function getProjects(req, res, next){
    var userId = req.params.id;
    console.log(userId);
    pg.connect( connectionString , function( err, client , done){
        if( err ){
            console.log(err);
        } else {
            client.query('select * from projects inner join calculations on (projects.id = calculations.project_id) where "user_id"=$1', [userId],function(err,results){
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

router.get('/?:id', function(req,res,next){

        getProjects(req,res,next);

});

router.post('/', function (req, res, next) {

    Users.findById(req.body.user_id).then(function (user) {
        //console.log('Found user:', user);


        var existingProjectId = {
            where: {
                project_name: req.body.project_name,
                user_id: req.body.user_id
            }
        };
        //Projects.sync().then(function () {
            Projects.find(existingProjectId).then(function (project) {
                console.log(project);
                // if returned project is null (does not exist)
                if (project === null) {

                    console.log('No project found. Creating...');
                    // create a new project using the values in the request body
                    Projects.create(req.body)
                        .then(function (project) {

                            // add the project to the user
                            user.addProject(project).then(function(){


                                project.dataValues.user_id = user.id;
                                // send the relevant part of the project object to client
                                res.send(project);

                            });

                        }).catch(function (err) {
                            console.log('there was an error', err);
                            res.send('error: ', err);
                        });
                } else {

                    // if project already exists, send status 409
                    res.sendStatus(409);
                }
            }).catch(function (err) {
                console.log(err);
                // status should only occur if there is an error internal to the database
                res.sendStatus(500)
            });
        //})
    })


});

router.put('/', function (req, res, next) {

    var existingUserByUsername = {
        where: {
            username: req.body.username
        }
    };

    Projects.update(req.body, existingUserByUsername)
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
    var existingUserById = {
        where: {
            id: req.params.id
        },

        // ensures only one project is found as fallback
        limit: 1,
        truncate: false
    };

    Projects.destroy(existingUserById)
        .then(function (project) {
            //console.log(project);
            res.sendStatus(200);
        }).catch(function (err) {
            console.log('there was an error', err);
            res.send('error: ', err);
        });
});

router.post('/calculation', function (req, res, next) {

    Projects.findById(req.body.project_id).then(function (project) {
        //console.log('Found user:', user);


        //var existingCalculationId = {
        //    where: {
        //        projectName: req.body.projectName,
        //        userId: req.body.user_id
        //    }
        //};
        //Projects.sync().then(function () {
        //Projects.find(existingProjectId).then(function (project) {
        //    console.log(project);
        //    // if returned project is null (does not exist)
        //    if (project === null) {
        //
        //        console.log('No project found. Creating...');
                // create a new project using the values in the request body
                Calculations.create(
                    req.body)
                    .then(function (calculation) {

                        // add the project to the user
                        project.addCalculation(calculation).then(function(){


                            calculation.dataValues.project_id = project.project_id;
                            // send the relevant part of the project object to client
                            res.send(project);

                        });

                    }).catch(function (err) {
                        console.log('there was an error', err);
                        res.send('error: ', err);
                    });
        //    } else {
        //
        //        // if project already exists, send status 409
        //        res.sendStatus(409);
        //    }
        //}).catch(function (err) {
        //    console.log(err);
        //    // status should only occur if there is an error internal to the database
        //    res.sendStatus(500)
        //});
        //})
    })


});


module.exports = router;

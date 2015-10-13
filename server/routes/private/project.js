const
    express = require('express'),
    router = express.Router(),
    expressJwt = require('express-jwt');

var Projects = require('../../models/models').Projects;
var Users = require('../../models/models').Users;

//router.use(expressJwt({secret: 'supersecret'}));

router.post('/', function (req, res, next) {


    Users.findById(req.body.user_id).then(function (user) {
        //console.log('Found user:', user);


        var existingProjectId = {
            where: {
                projectName: req.body.projectName,
                userId: req.body.user_id
            }
        };
        //Projects.sync().then(function () {
            Projects.find(existingProjectId).then(function (project) {
                console.log(project);
                // if returned project is null (does not exist)
                if (project === null) {

                    console.log('No project found. Creating...');
                    // create a new project using the values in the request body
                    Projects.create({
                        projectName: req.body.projectName})
                        .then(function (project) {

                            // add the project to the user
                            user.addProject(project).then(function(){


                                project.dataValues.userId = user.id;
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

module.exports = router;

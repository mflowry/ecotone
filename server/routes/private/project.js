const
    express = require('express'),
    router = express.Router(),
    expressJwt = require('express-jwt');

var Projects = require('../../models/projects');

//router.use(expressJwt({secret: 'supersecret'}));

router.post('/',function(req,res,next){

    var existingProjectId = {
        where: {
            //projectId: req.body.projectId,
            projectName: req.body.projectName
        }
    };

    Projects.sync().then(function () {


        Projects.find(existingProjectId).then(function(project){

            // if returned project is null (does not exist)
            if( project === null ) {

                // create a new project using the values in the request body
                Projects.create(req.body)
                    .then(function (project) {

                        // send the relevant part of the project object to client
                        res.send(project.dataValues);

                    }).catch(function (err) {
                        console.log('there was an error', err);
                        res.send('error: ', err);
                    });
            } else {

                // if project already exists, send status 409
                res.sendStatus(409);
            }
        }).catch(function( err ){

            // status should only occur if there is an error internal to the database
            res.sendStatus(500)
        });
    })

});

router.put('/', function(req, res, next) {

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
            res.send('error!',err);
        });
});

router.delete('/:id', function(req, res, next) {

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
            res.send('error: ',err);
        });
});

module.exports = router;

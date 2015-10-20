// dependencies
const
    should = require('should'),
    assert = require('assert'),
    Chance = require('chance'),
    request = require('supertest'),
    api = request('http://localhost:3000'),
    chance = new Chance();


/**
 * USER
 */

describe('The user API', function(){

    var newUser = {
       username: chance.last(),
       password: 'test',
       email: chance.email(),
       first_name: chance.last(),
       last_name: chance.last(),
       title: 'Dr',
       company_name: chance.last(),
       zip_code: '55101'
    };

    it('should create a new user', function( done ){

        api.post('/register')
            .send(newUser)
            .end(function( err, res ){

                //console.log(res);
                res.body.should.have.property('email', newUser.email);
                res.body.should.have.property('password', null);
                done();
            });
    });

    it('should prevent duplicate user from being created', function( done ){
        api.post('/register')
            .send(newUser)
            .expect(409, done);
    });

    var token;
    var user;

    it('should authorize a user', function( done ){

        api.post('/login')
            .send({
                username: newUser.username,
                password: newUser.password
            })
            .end(function( err, res ){
                res.body.should.have.property('user');
                res.body.should.have.property('token');
                token = res.body.token;
                user = res.body.user;
                done();
            })
    });

    it('should update a user', function( done ){

        var newName = chance.last();

        api.put('/modifyUser')
            .set('Authorization', 'Bearer ' + token)
            .send({first_name: newName, user_id: user.id})
            .expect(200, done);
    });

    it('should delete a user', function( done ){
        api.delete('/modifyUser/' + user.id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200, done);
    });
});

describe('A Calculation', function(){
    var newCalculation = {
        warmId: chance.integer({min:1, max:36}),
        weight: chance.floating()
    };


    it('should return a floating point number', function( done ){

        api.post('/calculations')
            .send(newCalculation)
            .end(function( err, res ){
                var a = parseFloat(res.body);
                a.should.be.a.float;
                done();
            });
    });
});

describe('The project/calculation API', function(){

    var newUser = {
        username: chance.last(),
        password: 'test',
        email: chance.email(),
        first_name: chance.last(),
        last_name: chance.last(),
        title: 'Dr',
        company_name: chance.last(),
        zip_code: '55101'
    };

    var newProject = {
        project_name: chance.last(),
        project_description: 'test this string 1'
    };

    var newCalculation1 = {
        category: chance.word(),
        sub_category: chance.word(),
        units: chance.word(),
        weight: chance.floating(),
        co2_offset: chance.floating(),
        item_description: chance.paragraph({sentences: 2})
    };

    var newCalculation2 = {
        category: chance.word(),
        sub_category: chance.word(),
        units: chance.word(),
        weight: chance.floating(),
        co2_offset: chance.floating(),
        item_description: chance.paragraph({sentences: 2})
    };

    var newCalculation3 = {
        category: chance.word(),
        sub_category: chance.word(),
        units: chance.word(),
        weight: chance.floating(),
        co2_offset: chance.floating(),
        item_description: chance.paragraph({sentences: 2})
    };

    it('should create a new user', function( done ){

        api.post('/register')
            .send(newUser)
            .end(function( err, res ){
                res.body.should.have.property('email', newUser.email);
                res.body.should.have.property('password', null);
                done();
            });
    });

    var token;
    var user;

    it('should authorize a user', function( done ){

        api.post('/login')
            .send({
                username: newUser.username,
                password: newUser.password
            })
            .end(function( err, res ){
                res.body.should.have.property('user');
                res.body.should.have.property('token');
                token = res.body.token;
                user = res.body.user;
                done();
            })
    });

    var project;

    it('should create a new project', function( done ){
        var projToSend = newProject;
        projToSend.user_id = user.id;
        api.post('/project')
            .set('Authorization', 'Bearer ' + token)
            .send(projToSend)
            .end(function( err, res ){
                res.body.should.have.property('project_name', newProject.project_name);
                res.body.should.have.property('project_description', newProject.project_description);
                project = res.body;
                done();
            });
    });

    it('should prevent duplicate projects from being created', function( done ){
        api.post('/project')
            .set('Authorization', 'Bearer ' + token)
            .send(newProject)
            .expect(409, done);
    });
    //

    //
    it('should update a project', function( done ){

        var newName = chance.last();
        var newDescription = chance.paragraph({sentences: 2});
        var projectId = project.id;

        var updatedProject = {
            project_name: newName,
            project_description: newDescription,
            project_id: projectId
        };

        api.put('/project')
            .set('Authorization', 'Bearer ' + token)
            .send(updatedProject)
            .expect(200, done);
    });

    var calculations;

    it('should create a single project calculation', function(done){

        var calcToSend = [];
        newCalculation1.project_id = project.id;
        calcToSend.push(newCalculation1);

        api.post('/project/calculation')
           .set('Authorization', 'Bearer ' + token)
           .send(calcToSend)
           //.end(function( err, res ){
                //console.log(res.body);
                //res.body.should.have.length(1);
                //res.body[0].should.have.property('category', newCalculation.category);
                //res.body[0].should.have.property('sub_category', newCalculation.sub_category);
                //calculations = res.body;
                //done();
            .expect(200, done);
           //});
    });

    it('should create multiple project calculations', function(done){

        var calcToSend = [];
        newCalculation2.project_id = project.id;
        newCalculation3.project_id = project.id;
        calcToSend.push(newCalculation2);
        calcToSend.push(newCalculation3);

        api.post('/project/calculation')
            .set('Authorization', 'Bearer ' + token)
            .send(calcToSend)
            //.end(function( err, res ){
            //console.log(res.body);
            //res.body.should.have.length(1);
            //res.body[0].should.have.property('category', newCalculation.category);
            //res.body[0].should.have.property('sub_category', newCalculation.sub_category);
            //calculations = res.body;
            //done();
            .expect(200, done);
        //});
    });

    var calculation;

    it('should return a list of projects', function(done){
        api.get('/project/?user_id=' + user.id + '&project_id=' + project.id)
            .set('Authorization', 'Bearer ' + token)
            .end(function(err,res){
                res.body[0].should.have.property('user_id', user.id);
                res.body[0].should.have.property('project_id', project.id);

                calculation = res.body[0];

                done();
            });
    });


    it('should update a single calculation', function( done ){

            var updatedProjectCalculation = {
                category: chance.last(),
                item_description: chance.paragraph({sentences: 2}),
                calculation_id: calculation.id
            };

            api.put('/project/calculation')
                .set('Authorization', 'Bearer ' + token)
                .send(updatedProjectCalculation)
                .expect(200, done);
        });



    it('should delete a project', function( done ){
        api.delete('/project/' + project.id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200, done);
    });

    it('should delete a calc', function( done ){
        api.delete('/project/calculation/' + calculation.id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200, done);
    });

    it('should delete a user', function( done ){
        api.delete('/modifyUser/' + user.id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200, done);
    });
});
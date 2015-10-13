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
       firstName: chance.last(),
       lastName: chance.last(),
       title: 'Dr',
       companyName: chance.last(),
       zipCode: '55101'
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
            .send({firstName: newName})
            .expect(200, done);
    });

    it('should delete a user', function( done ){
        api.delete('/modifyUser/' + user.id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200, done);
    })
});

describe('A Calculation', function(){
    var newCalculation = {
        warmId: chance.integer({min:1, max:36}),
        weight: chance.floating()
    };

    console.log(newCalculation.weight);

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

describe('The project API', function(){

    var newProject = {
        username: chance.last(),
        password: 'test',
        email: chance.email(),
        firstName: chance.last(),
        lastName: chance.last(),
        title: 'Dr',
        companyName: chance.last(),
        zipCode: '55101'
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
            .send({firstName: newName})
            .expect(200, done);
    });

    it('should delete a user', function( done ){
        api.delete('/modifyUser/' + user.id)
            .set('Authorization', 'Bearer ' + token)
            .expect(200, done);
    })
});
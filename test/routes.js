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

describe('A user', function(){

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
        this.timeout(5000);

        api.post('/register')
            .send(newUser)
            .end(function( err, res ){
                res.body.should.have.property('email', newUser.email);
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


        var loginUser = {
            username: newUser.username,
            password: newUser.password
        };

        api.post('/login')
            .send(loginUser)
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
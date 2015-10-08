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
       title: 'Dr.',
       companyName: chance.last(),
       zipCode: chance.zip()
   }
});
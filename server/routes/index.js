var express = require('express');
var router = express.Router();
var pg = require('pg');

//set up database for Heroku
//primaries table  -- do I need one block per table?  diff DATABASE_URL per table? diff route per table?
app.get('/db', function (request, response) {
  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
    client.query('SELECT * FROM primaries', function(err, result) {
      done();
      if (err)
      { console.error(err); response.send("Error " + err); }
      else
      { response.render('pages/db', {results: result.rows} ); }
    });
  });
});
//
////secondaries table
//app.get('/db', function (request, response) {
//  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
//    client.query('SELECT * FROM secondaries', function(err, result) {
//      done();
//      if (err)
//      { console.error(err); response.send("Error " + err); }
//      else
//      { response.render('pages/db', {results: result.rows} ); }
//    });
//  });
//});
//
////proxies table
//app.get('/db', function (request, response) {
//  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
//    client.query('SELECT * FROM proxies', function(err, result) {
//      done();
//      if (err)
//      { console.error(err); response.send("Error " + err); }
//      else
//      { response.render('pages/db', {results: result.rows} ); }
//    });
//  });
//});
//
////users table
//app.get('/db', function (request, response) {
//  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
//    client.query('SELECT * FROM users', function(err, result) {
//      done();
//      if (err)
//      { console.error(err); response.send("Error " + err); }
//      else
//      { response.render('pages/db', {results: result.rows} ); }
//    });
//  });
//});
//
////projects table
//app.get('/db', function (request, response) {
//  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
//    client.query('SELECT * FROM projects', function(err, result) {
//      done();
//      if (err)
//      { console.error(err); response.send("Error " + err); }
//      else
//      { response.render('pages/db', {results: result.rows} ); }
//    });
//  });
//});
//
////calculations table
//app.get('/db', function (request, response) {
//  pg.connect(process.env.DATABASE_URL, function(err, client, done) {
//    client.query('SELECT * FROM calculations', function(err, result) {
//      done();
//      if (err)
//      { console.error(err); response.send("Error " + err); }
//      else
//      { response.render('pages/db', {results: result.rows} ); }
//    });
//  });
//});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ecotone Calculator' });
});


module.exports = router;

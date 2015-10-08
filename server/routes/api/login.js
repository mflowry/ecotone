const
    express = require('express'),
    router = express.Router();

var Users = require('../../models/users');

router.post('/', function(req, res, next) {
  Users.getAuthenticated(req.body, function (err, token) {
    if (err) {
      console.log('ERROR',err.message);
      res.status(400).send(err.message);
    } else {
      res.send(token);
    }
  });
});

module.exports = router;

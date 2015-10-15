const
    express = require('express'),
    router = express.Router();

router.post('/', function(req, res){
    console.log(req.body);
    res.sendStatus(200);

});

module.exports = router;
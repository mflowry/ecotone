var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/login', function(req, res, next) {
    res.render('adminLogin', { title: 'Admin Login' });
});

router.post('/admin', function( req, res, next ){

    if(req.body.username == process.env.adminUser && req.body.password == process.env.adminPass){
        res.render('admin', { title: 'Admin'} )
    } else {
        res.sendStatus(404);
    }

});

module.exports = router;

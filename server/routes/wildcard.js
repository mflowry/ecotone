const
    express = require('express'),
    router = express.Router();

router.get('/*', function (req, res, next) {
    var url = req.originalUrl;
    if (url.split('.').length > 1) {
        next(); // this should be handled by your 404 handler, optionally use res.sendStatus(404);
    } else {
        // handles angular urls. i.e. anything without a '.' in the url (so files aren't handled)
        var newurl = '/#' + url;
        console.log('Catch all handled url: ' + req.originalUrl, 'New url: ' + newurl);
        res.redirect(newurl);
    }
});

module.exports = router;
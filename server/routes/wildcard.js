
router.get('/*', function(req, res, next){
  var url = req.url;
  if (url.split('.').length > 1){
    next(); // this should be handled by your 404 handler, optionally use res.sendStatus(404);
  } else {
    // handles angular urls. i.e. anything without a '.' in the url (so files aren't handled)
    console.log('Catch all handled url: ' + req.originalUrl);
    res.redirect('/#' + req.url);
  }
});
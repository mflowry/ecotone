// APPLICATION DEPENDENCIES
const
    express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    jsonwebtoken = require('jsonwebtoken'),
    models = require('./models/models');

// ROUTING PATHS
const
    routes = require('./routes/index'),
    login = require('./routes/public/login'),
    materials = require('./routes/public/materials'),
    register = require('./routes/public/register'),
    modifyUser = require('./routes/private/modifyUser'),
    calculations = require('./routes/public/calculations'),
    project = require('./routes/private/project'),
    suggestion = require('./routes/public/suggestion'),
    bulk = require('./routes/public/bulkUpload');




var app = express();

models.Users.sync().then(function(){
    models.Projects.sync().then(function(){
        models.Calculations.sync();
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));

app.use('/', routes);
app.use('/login', login);
app.use('/materials', materials);
app.use('/register',register);
app.use('/modifyUser',modifyUser);
app.use('/calculations',calculations);
app.use('/project',project);
app.use('/suggestion', suggestion);
app.use('/bulk', bulk);
app.use('*', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
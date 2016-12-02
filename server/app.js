require('babel-register')({
    presets: ['es2015', 'react']
});

var express = require('express');
var app = express();
var http = require('http').Server(app);
var path = require('path');
var flash = require('connect-flash');
var bodyParser = require('body-parser');
var passport = require('passport');
var compression = require('compression');
var contactForm = require('./controllers/contactForm');

var models = require('./models');

global.__ENVIRONMENT__ = process.env.NODE_ENV || 'default';

// configure webpack middleware
var webpack = require('webpack');
var dev = require('webpack-dev-middleware');
var hot = require('webpack-hot-middleware');
var config = require('../webpack.config.js');

if (process.env.NODE_ENV !== 'production') {
    const compiler = webpack(config);

    app.use(dev(compiler, {
        publicPath: config.output.publicPath,
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    }));
    app.use(hot(compiler));
}

// configure express
app.use(compression());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('dist'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(flash());

// Sessions and auth
var sessionStore = require('./services/sessions-config')(app);
require('./services/passport-config');
app.use(passport.initialize());
app.use(passport.session());

// global vars
app.use((req, res, next) => {
    console.log('client connected');
    res.locals.renderer = 'ejs';
    res.locals.title ='';
    res.locals.metaDesc = '';
    res.locals.auth = req.isAuthenticated();
    res.locals.activeClass = '';
    next();
});

// auth routes
app.use(require(__dirname + '/routes/auth'));

// authenticate admin routes
app.use('/admin*', (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
        next();
        return;
    }
    res.redirect('/login');
});

// admin router
app.use('/admin', require(__dirname + '/routes/admin'));

// api router (used here only for contact posting)
app.use('/api', require(__dirname + '/routes/api'));

// socket.io
require('./routes/liveChat').socketio(http, sessionStore);

// 404 handling
app.use(function(req, res, next){
    res.status(404);

    if (req.accepts('html')) {
        res.render('error', { status: 404, url: req.url, title: 'error' });
        return;
    }

    if (req.accepts('json')) {
        res.send({ error: 'Not found' });
        return;
    }

    res.type('txt').send('Not found');
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            status: 500,
            stack: err.stack,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//     res.status(err.status || 500);
//     res.render('error', {
//         message: err.message,
//         error: {}
//     });
// });

// logging
// app.use(require('./logging')); //morgan
// require('express-debug')(app, {});

// Otherwise errors thrown in Promise routines will be silently swallowed.
// (e.g. any error during rendering the app server-side!)
process.on('unhandledRejection', (reason, p) => {
    if (reason.stack) {
        console.error(reason.stack);
    } else {
        console.error('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
    }
});

var debug = require('debug')('jg');
app.set('port', process.env.PORT || 3100);

models.sequelize.sync({
    force: false,
    })
    .then(function () {
        var server = http.listen(app.get('port'), function() {
            console.log('Express server listening on port ' + server.address().port);
            console.log("Node Environment: " + process.env.NODE_ENV);
        });
});

var session = require('express-session');
var config = require('../../APPconfig');
var DBconfig = require('../../DBconfig.json')[process.env.NODE_ENV || 'development'];
var MySQLStore = require('express-mysql-session')(session);

var options = {
    host: DBconfig.host,
    port: 3306,
    user: DBconfig.username,
    password: DBconfig.password,
    database: DBconfig.database,
    checkExpirationInterval: 3600000,
    expiration: 432000000,
};

var sessionStore;

module.exports = function (app) {

    if (DBconfig.dialect === 'mysql') {

        sessionStore = new MySQLStore(options);

    } else if (DBconfig.dialect === 'postgres') {

        var pg = require('pg');
        var pgSession = require('connect-pg-simple')(session);
        sessionStore = new pgSession({
            pg: pg,  // Use global pg-module
            conString: 'postgresql://' + options.user + ':' +
                options.password + '@' + options.host +
                (options.port ? ':' + options.port : '') + '/react_help_desk',
                tableName: 'sessions' // Use another table-name than the default "session" one
        });
    }

    app.use(session({
        store: sessionStore,
        key: config.__SESSION_KEY__,
        secret: config.__SESSION_SECRET__,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 5 * 24 * 60 * 60 * 1000 } // 5 days
    }));

    return sessionStore;
};


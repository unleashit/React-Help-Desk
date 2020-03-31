var session = require('express-session');
var config = require('../../APPconfig');
var DBconfig = require('../../DBconfig.json')[process.env.NODE_ENV || 'development'];

var options = {
    host: DBconfig.host,
    port: DBconfig.port,
    user: DBconfig.username,
    password: DBconfig.password,
    database: DBconfig.database,
    checkExpirationInterval: 3600000,
    expiration: 432000000,
};

var sessionStore;

module.exports = function (app) {

    if (DBconfig.dialect === 'mysql') {

        var MySQLStore = require('express-mysql-session')(session);
        sessionStore = new MySQLStore(options);

    } else if (DBconfig.dialect === 'postgres') {

        var pg = require('pg');
        var pgSession = require('connect-pg-simple')(session);
        sessionStore = new pgSession({
            pg: pg,  // Use global pg-module
            conString: 'postgresql://' + options.user + ':' +
                options.password + '@' + options.host +
                (options.port ? ':' + options.port : '') + '/' + options.database,
                tableName: 'session' // Optionally use another table-name than the default "session"
        });

    } else {

        throw new Error(`This script only supports mysql or postgres sessions out of the box.
            If you want to use another DB, please add the appropriate
            session connector and modify sessions-config.js`);
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

var passport = require("passport");
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');
var _ = require("lodash");
var model = require('./../models/index');

passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done){
    model.User.findOne({
        where: {
            'email': email
        }
    })
    .then(function(user) {
        //console.log('you typed: ' + email, password);

        if (user === null) {
            return done(null, false, {message: 'Incorrect credentials.'})
        }

        var hashedPassword = bcrypt.hashSync(password, user.salt);

        if (user.password === hashedPassword) {
            return done(null, user);
        }

        return done(null, false, {message: 'Incorrect credentials.'});
    })
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

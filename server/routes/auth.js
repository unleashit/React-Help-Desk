var express = require('express');
var passport = require('passport');
var _ = require('lodash');
var createuser = require('../controllers/createUser');
var router = express.Router();

router.route('/signup')
    .get((req, res) => {
        res.render("signup", { title: 'Signup', error: req.flash('error') });
    })
    .post(createuser.signup);

router.get('/login', function (req, res, next) {

    // auto login as admin for development
    // if (req.app.get('env') === 'development') {
    //     if (req.query.user) {
    //         user = _.find(users, u=> u.email === req.query.user);
    //
    //         req.logIn(user, (err) => {
    //             if (err) { return next(err); }
    //             return res.redirect('/');
    //         });
    //         return;
    //     }
    // }

    res.render('login', {title: 'login', message: req.flash('error')});
});

router.post("/login", function(req, res, next) {
    var pattern = /^\s*$/;
    if (pattern.test(req.body.username) || pattern.test(req.body.password)) {
        res.render('login', {message: 'Please enter a username and password'});
    } else {
        next();
    }
}, passport.authenticate('local', {
    successRedirect: '/admin/live-chat-manager',
    failureRedirect: '/login',
    failureFlash : true
}));

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

module.exports = router;
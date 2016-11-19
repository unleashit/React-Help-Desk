'use strict';

var express = require('express');
var _ = require('lodash');
var path = require('path');
var crypto = require('crypto');
var bodyParser = require('body-parser');
var liveChat = require('../controllers/liveChat.js');
var router = express.Router();
router.use(bodyParser.urlencoded({ extended: true }));

// check logged in user has sufficient privileges
router.use((req, res, next) => {
    if (req.user.useraccess === 3) {
        next();
        return;
    }
    // TODO: test status not sending to error view
    res.status(404);
    res.render('error', { url: req.url, status: 404, title: 'error'});
});

//routes

router.get('/live-chat-manager', liveChat.chatManager);

module.exports = router;

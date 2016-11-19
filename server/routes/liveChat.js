var path = require('path');
var nodemailer = require('nodemailer');
var passportSocketIo = require('passport.socketio');
var config = require(path.join(__dirname, '../../APPconfig'));
var liveChatController = require('../controllers/liveChat');

exports.socketio = function(http, sessionStore) {

    var io = require('socket.io')(http);
    var chat = io.of('/help-desk');

    liveChatController.initSaveChatData(chat);

    chat.on('connection', function(socket) {
        console.log('Sockets connected: %s', io.engine.clientsCount);

        chat.use(passportSocketIo.authorize({
            cookieParser: require('cookie-parser'), // optional your cookie-parser middleware function. Defaults to require('cookie-parser')
            key:          config.__SESSION_KEY__,       // make sure is the same as in your session settings in app.js
            secret:       config.__SESSION_SECRET__,      // make sure is the same as in your session settings in app.js
            store:        sessionStore,        // you need to use the same sessionStore you defined in the app.use(session({... in app.js
            success:      liveChatController.onAuthorizeSuccess,
            fail:         liveChatController.onAuthorizeFail,
        }));

        socket.on('admin login', liveChatController.adminLogin.bind(this, socket, chat));
        socket.on('chatConnected', liveChatController.chatConnected.bind(this, socket, chat));
        socket.on('newUser', liveChatController.newUser.bind(this, socket, chat));
        socket.on('chatMessage', liveChatController.chatMessage.bind(this, socket, chat));
        socket.on('disconnect', liveChatController.disconnect.bind(this, socket, chat));
        socket.on('admin getUsers', liveChatController.adminGetUsers.bind(this, socket, chat));
        socket.on('admin remove', liveChatController.adminRemoveUser.bind(this, socket, chat));
        socket.on('admin delete', liveChatController.adminDeleteUser.bind(this, socket, chat));
        socket.on('typing', liveChatController.typing.bind(this, socket, chat));

    });
};

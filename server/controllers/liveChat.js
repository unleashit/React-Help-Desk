var path = require('path');
var nodemailer = require('nodemailer');
var config = require(path.join(__dirname, '../../APPconfig'));
var liveChatData = require('./liveChatData');

var users = {};
var admin = null;
var isAuthorized = false;

function _sendSMS(user) {

    config.smsMailOptions.text = `A new user has logged onto live chat on jasongallagher.org: ${user}`;

    var transporter = nodemailer.createTransport(config.smtpConfig);

    transporter.sendMail(config.smsMailOptions, function(error, info) {
        if (error){
            console.log('error from sendMail method: ', error);
        } else {
            console.log(`SMS sent`);
        }
    });
}

function _handleQueryUser(socket, chat, message) {
    liveChatData.queryUser(message.room)
        .then((user) => {
            if (user) {
                users[user.id] = user;
                console.log("User restored from DB: ", user);

                // add the user back to the room and restore to admin
                socket.join(message.room);
                if (admin) {
                    admin.join(message.room);
                    socket.broadcast.to(admin.id).emit('admin userInit', users);
                    console.log('Restored user sent to admin: ', user);
                }

                // add the new message and broadcast
                users[user.id].messages.push(message);
                if (admin) _handleQueryUsers(socket, users, 0);
                chat.in(message.room).emit('chatMessage', message);

            } else {
                console.log('Message from unregistered socket: %s', socket.id);
            }
        });
}

function _handleQueryUsers(socket, users, offset) {
    socket.emit('admin userInit', users);
    liveChatData.queryUsers(users, offset)
        .then(archivedUsers => {
            socket.emit('admin archivedUserUpdate', archivedUsers);
            console.log("%s archived users sent to admin", archivedUsers.users.length);
        });
}

exports.initSaveChatData = function(chat) {
    setInterval(() => {
        if (!Object.keys(users).length) return;
        liveChatData.save(users)
            .then(() => {
                console.log("users were saved to the DB");
                users = liveChatData.filterOld(users, chat);
            })
            .catch(err => {
                throw new Error(err);
            });
    }, config.liveChat.saveInterval);
};

exports.onAuthorizeSuccess = function(data, accept) {
    console.log('socket.io: admin is authed');
    isAuthorized = true;
    accept();
};

exports.onAuthorizeFail = function(data, message, error, accept) {
    isAuthorized = false;
    accept(); // normal users should pass through
};

exports.chatConnected = function (socket, chat, message, callback) {

    // if admin is logged in, inform client of status
    if (admin) {
        // var payload = {id: admin.id, name: admin.name};
        callback({id: admin.id, name: admin.name});
    } else {
        callback(null);
    }
};

exports.newUser = function(socket, chat, user, callback) {

    users[socket.id] = {
        id: socket.id,
        name: user.name,
        email: user.email,
        connected: true,
        date: Date.now(),
        messages: []
    };

    socket.join(socket.id);

    if (admin) {
        admin.join(socket.id);
        socket.broadcast.to(admin.id).emit('admin userInit', users);
        console.log('New user to admin: %s', user.name);
    } else {
        const message = {
            id: null,
            room: socket.id,
            name: config.liveChat.adminName,
            message: 'I\'m currently away, but I will receive your messages and get back to you very soon!',
            date: Date.now()
        };
        socket.emit('chatMessage', message)
    }

    // callback sends namespaced room id back to client
    callback(socket.id);

    // send sms
    if (config.liveChat.sendSMS) {
        try {
            _sendSMS(user.name);
        } catch(err) {
            throw new Error(err);
        }
    }

};

exports.chatMessage = function(socket, chat, message) {
    if (message.room in users) {
        users[message.room].messages.push(message);
        chat.in(message.room).emit('chatMessage', message);
        console.log('User:', JSON.stringify(users[message.room], null, 2));
    } else {
        console.log("dino");
        _handleQueryUser(socket, chat, message);
    }
};

exports.typing = function (socket, chat, id) {
    console.log("typing: " + id);
    chat.in(id).emit("typing", socket.id);
};

exports.disconnect = function(socket, chat) {
    if (socket.id in users) {
        users[socket.id].connected = false;
        console.log("Client disconnected");
        // console.log(id, users[id]);
    } else if (admin && socket.id === admin.id) {
        console.log('Admin disconnected');
        admin = null;
        isAuthorized = false;
        socket.broadcast.emit('chatDisconnected');
    }
    chat.in(socket.id).emit('disconnect', socket.id);
    socket.disconnect();
    // console.log("Disconnected %s sockets remaining", io.engine.clientsCount);
};

exports.adminLogin = function(socket, chat, message, callback) {
    if (isAuthorized) {
        admin = socket;
        admin.name = config.liveChat.adminName;

        Object.keys(users).forEach(u => {
            admin.join(users[u].id);
        });

        socket.broadcast.emit('chatConnected', {id: admin.id, name: admin.name});
        console.log("admin logged in");

        // send namespaced id back to client
        callback(socket.id);

        // get archived users from DB and send to admin
        _handleQueryUsers(socket, users, 0);

    } else {
        admin = null;
        console.log('Admin has incorrect credentials!');
    }
};

exports.adminGetUsers = function (socket, chat, offset) {
    _handleQueryUsers(socket, users, offset);
};

exports.adminRemoveUser = function (socket, chat, user){
    if (admin && isAuthorized) {

        if (chat.connected[user]) {
            chat.connected[user].disconnect();
            console.log('%s was deleted and disconnected by admin.', user);
        }

        if (user in users) {
            users[user].connected = false;

            liveChatData.save(users)
                .then(() => {
                    console.log("users were saved to the DB");
                    delete users[user];
                    // console.log(admin);
                    _handleQueryUsers(socket, users, 0)
                })
                .catch(err => {
                    throw new Error(err);
                });
        }
    }
};

exports.adminDeleteUser = function (socket, chat, user) {
    if (admin && isAuthorized) {

        if (user in users) {
            chat.connected[user].disconnect();
            delete users[user];
        }

        liveChatData.deleteUser(user)
            .then(() => {
                console.log("%s was deleted from DB", user);

                // send new archived user list to admin
                _handleQueryUsers(socket, users, 0);
                return null;
            })
            .catch(err => {
                console.log('User could not be deleted:');
                throw new Error(err);
            });
    }
};

// /admin/live-chat-manager standard route
exports.chatManager = function(req, res) {

    res.render("live-chat-manager", {
        title: "Manage React Help Desk",
        activeClass: 'manage-live-chat',
        auth: req.isAuthenticated()
    });
};


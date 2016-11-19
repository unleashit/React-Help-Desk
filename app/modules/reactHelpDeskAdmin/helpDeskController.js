import * as render from './helpDeskRender'
import config from '../../../APPconfig';
var ionSound = require('../reactHelpDesk/libs/ion-sound')();
import {
    socket,
    messageList,
    userList,
    archivedUserList,
    message,
    postMessage,
    postBox,
    state as props,
    setState,
    newMessage,
    setConnected,
    deleteUser
} from './admin';

ionSound.sound({
    sounds: [{ name: 'water_droplet_3' }],
    volume: 0.5,
    path: '/sounds/',
    preload: true
});

// *
// * socket.io callbacks
// *

export function socketConnect() {
    socket.emit('admin login', {}, (id) => {
        setState({adminId: id});
        // console.log(`socket.io connected. Id: ${props.adminId}`);
    });
}

export function socketUserInit(usersFromServer) {
    // console.log('users update:', usersFromServer);
    setState({
        users: usersFromServer || {}
    });
    const keys = Object.keys(props.users);

    if (keys.length > 0) {
        setState({currentUser: keys[0]});
        postBox.style.display = "block";
    }

    userList.innerHTML = render.renderUserList();
    messageList.innerHTML = render.renderMessageList(props.currentUser, props.users);
    messageList.scrollTop = messageList.scrollHeight;
}

export function socketChatmessage(message) {
    // console.log('message received', message);
    if (message.room in props.users) {
        newMessage(message.room, message);
        userList.innerHTML = render.renderUserList();

        // ensures active class is removed
        archivedUserList.innerHTML = render.renderArchivedUserList(props.currentOffset);

        if (props.currentUser === message.room) {
            messageList.innerHTML = render.renderMessageList(message.room, props.users);
            messageList.scrollTop = messageList.scrollHeight;
        }

        // add 'new-messages' class only if message is from client
        // TODO: persist the class after next renderMessages if needed
        if (message.id !== props.adminId) {
            document.querySelector(`[data-user-id='${message.room}']`)
                .classList.toggle('new-messages');
        }
    } else {
        console.log('Message from unregistered Socket ID: ', message);
    }

    ionSound.sound.play('water_droplet_3');
}

export function socketIsTyping(resp) {
    // console.log('socket is typing!!');
    const elem = document.querySelector(`#userList [data-user-id="${resp}"]`);

    if (!elem) return;

    if (props.isTyping) {
        window.clearTimeout(props.typingTimer);
    } else {
        setState({
            isTypingDetails: elem.innerHTML
        });
    }

    elem.innerHTML = 'user is typing...';
    setState({isTyping: true});

    setState({
        typingTimer: window.setTimeout(() => {
            elem.innerHTML = props.isTypingDetails;
            setState({isTyping: false});
        }, 1500)
    });
}

export function socketArchivedUserUpdate(usersFromServer) {
    setState({
        archivedUsers: usersFromServer.users || {},
        totalUsers: usersFromServer.count
    });

    archivedUserList.innerHTML = render.renderArchivedUserList(props.currentOffset);

    if (document.getElementById('pagination')) {
        document.getElementById('pagination')
            .addEventListener('click', handleChangePagination);
    }
}

export function socketDisconnect(userID) {
    console.log(`${userID} was disconnected`);
    if (userID in props.users) {
        setConnected(userID, false);
        userList.innerHTML = render.renderUserList();
    }
}

// *
// * UI event callbacks
// *

export function handleOnChange() {
    socket.emit('typing', props.currentUser);
}


export function handleSubmit(e) {
    e.preventDefault();
    let {adminId, currentUser} = props;

    if (e.keyCode === 13 || e.target.getAttribute('id') === 'postMessage') {
        const msg = document.getElementById('message');
        const val = msg.value.trim();

        if (!val || !currentUser || !adminId) return;

        const message = {
            id: adminId,
            name: config.liveChat.adminName,
            room: currentUser,
            message: val,
            date: Date.now()
        };
        socket.emit('chatMessage', message);
        msg.value = '';
    }
}

export function userListListener(e) {
    e.stopPropagation();

    if (!e.currentTarget.children.length) return;

    if (e.target.getAttribute('data-remove') === 'removeUser') {
        const userID = e.target.parentNode.getAttribute('data-user-id');
        console.log('user to remove: ', userID);
        deleteUser(userID);
        socket.emit('admin remove', userID);
        userList.innerHTML = render.renderUserList();

    } else {
        setState({
            currentUser: e.target.getAttribute('data-user-id') ||
                e.target.parentNode.getAttribute('data-user-id')
        });
        userList.innerHTML = render.renderUserList();
        messageList.innerHTML = render.renderMessageList(props.currentUser, props.users);
        messageList.scrollTop = messageList.scrollHeight;
        postBox.style.display = "block";
    }

    // ensures active class is removed
    archivedUserList.innerHTML = render.renderArchivedUserList(props.currentOffset);
}

export function archivedUserListListener(e) {
    e.stopPropagation();

    if (!e.currentTarget.children.length) return;

    if (e.target.getAttribute('data-delete') === 'deleteUser') {

        // deleting a user
        const userID = e.target.parentNode.getAttribute('data-user-id');
        socket.emit('admin delete', userID);
    } else {

        // view archived messages
        setState({
            currentUser: e.target.getAttribute('data-user-id') ||
            e.target.parentNode.getAttribute('data-user-id')
        });
        archivedUserList.innerHTML = render.renderArchivedUserList(props.currentOffset);
        userList.innerHTML = render.renderUserList();
        messageList.innerHTML = render.renderMessageList(props.currentUser, props.archivedUsers);
        messageList.scrollTop = messageList.scrollHeight;
        postBox.style.display = "none";

        if (document.getElementById('pagination')) {
        document.getElementById('pagination')
            .addEventListener('click', handleChangePagination);
        }
    }
}

export function handleChangePagination(e) {
    e.stopPropagation();

    const pageNumber = e.target.innerText;

    setState({
        currentOffset: (pageNumber * props.perPage) - props.perPage
    });

    socket.emit('admin getUsers', props.currentOffset);
    // archivedUserList.innerHTML = render.renderArchivedUserList(props.currentOffset);
}
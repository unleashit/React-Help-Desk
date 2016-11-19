import * as controller from './helpDeskController'
import * as render from './helpDeskRender'
import io from 'socket.io-client';
import config from '../../../APPconfig';

import './scss/admin.scss';

export const socket = io.connect(config.__SOCKET_IO_URL__);
export const userList = document.getElementById('userList');
export const archivedUserList = document.getElementById('archivedUserList');
export const messageList = document.getElementById('messages');
export let message = document.getElementById('message');
export const postMessage = document.getElementById('postMessage');
export const postBox = document.getElementById('postBox');

export let state = {
    users:  {},
    totalUsers: 0,
    archivedUsers: {},
    perPage: config.liveChat.adminPerPage,
    currentOffset: 0,
    adminId: null,
    currentUser: null,
    isTyping: false,
    isTypingDetails: null,
    typingTimer: null
};

export function setState(payload) {
    Object.keys(payload).forEach(key => {
        state[key] = payload[key];
    });
}

export function newMessage(room, message) {
    state.users[room].messages.push(message);
}

export function setConnected(userID, bool) {
    state.users[userID].connected = bool;
}

export function deleteUser(userID) {
    delete state.users[userID]
}

function init() {
    if (!userList) return;

    socket.on('connect', controller.socketConnect );
    socket.on('admin userInit', controller.socketUserInit);
    socket.on('admin archivedUserUpdate', controller.socketArchivedUserUpdate);
    socket.on('chatMessage', controller.socketChatmessage);
    socket.on('disconnect', controller.socketDisconnect);
    socket.on('typing', controller.socketIsTyping);

    userList.addEventListener('click', controller.userListListener);
    archivedUserList.addEventListener('click', controller.archivedUserListListener);
    postMessage.addEventListener('click', controller.handleSubmit);
    message.addEventListener('input', controller.handleOnChange);
    message.addEventListener('keyup', controller.handleSubmit);

    userList.innerHTML = render.renderUserList();
    messageList.innerHTML = '';
    postBox.style.display = 'none';
}

init();
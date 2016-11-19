import io from 'socket.io-client';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import LiveChat from './helpDesk';
import * as chatActions from './helpDeskActions';
import { __API_URL__, __SOCKET_IO_URL__ } from '../../../APPconfig';

// require('./scss/_live-chat.scss');
var ionSound = require('./libs/ion-sound')();

class LiveChatContainer extends Component {

    constructor(props) {
        super(props);
        this.socketConnect = this.socketConnect.bind(this);
        this.socketAdminConnected = this.socketAdminConnected.bind(this);
        this.socketAdminDisconnected = this.socketAdminDisconnected.bind(this);
        this.socketChatmessage = this.socketChatmessage.bind(this);
        this.socketTyping = this.socketTyping.bind(this);
        this.socketDisconnect = this.socketDisconnect.bind(this);
    }

    componentDidMount() {
        this.socket = io(__SOCKET_IO_URL__);
        this.socket.on('connect', this.socketConnect);
        this.socket.on('chatConnected', this.socketAdminConnected);
        this.socket.on('chatDisconnected', this.socketAdminDisconnected);
        this.socket.on('chatMessage', this.socketChatmessage);
        this.socket.on('typing', this.socketTyping);
        this.socket.on('disconnect', this.socketDisconnect);

        ionSound.sound({
            sounds: [{ name: 'water_droplet_3' }],
            volume: 0.5,
            path: '/sounds/',
            preload: true
        });
    }

    componentWillUnmount() {
        clearTimeout(this.typingTimer);
    }

    socketConnect() {
        // console.log("socket id: " + this.socket.id);

        this.socket.emit('chatConnected', {}, (admin) => {
            if (admin) {
                // admin is online
                this.props.dispatch(chatActions.chatSetRemoteId(admin.id, admin.name));
                // console.log('Chat is online');
            }
            if (!this.props.liveChat.serverStatus) {
                // let the app know server is online
                this.props.dispatch(chatActions.chatSetServerStatus(true));
            }
        });
    }

    socketChatmessage(message) {
        console.log('received a message!');
        if (message.id !== this.props.liveChat.room) {
            clearTimeout(this.typingTimer);
            this.props.dispatch(chatActions.chatIsTyping(false));
            ionSound.sound.play('water_droplet_3');
        }
        this.props.dispatch(chatActions.chatReceiveMesssage(message));
    }

    socketTyping(id) {
        if (id === this.props.liveChat.remoteId) {
            clearTimeout(this.typingTimer);
            this.props.dispatch(chatActions.chatIsTyping(true));
            this.typingDelay();
        }
    }

    socketAdminConnected(admin) {
        if (admin) {
            // console.log("Chat is online");
            this.props.dispatch(chatActions.chatSetRemoteId(admin.id, admin.name));
        }
    }

    socketAdminDisconnected() {
        // console.log("Chat is offline");
        this.props.dispatch(chatActions.chatSetRemoteId('', ''));
    }

    socketDisconnect(message) {
        // console.log('Disconnected from Server: ', message);
        if (message === 'transport close') {
            // server disconnected
            this.props.dispatch(chatActions.chatSetServerStatus(false));
            this.props.dispatch(chatActions.chatSetRemoteId('', ''));
        }
    }

    newUser(e) {
        e.preventDefault();
        const name = e.currentTarget[0].value.trim();
        const email = e.currentTarget[1].value.trim();
        if (!name) return;

        // chat is offline, send email
        if (!this.props.liveChat.remoteId) {
            const message = e.currentTarget[2].value.trim();
            if (!email || !message) return;
            if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) return;

            const contactData = { name, email, message };

            return fetch(`${__API_URL__}/contact`, {
                method: 'POST',
                body: JSON.stringify(contactData),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
            .then((response) => {
                this.props.dispatch(chatActions.contactSent(true));
                // console.log("contact sent");
            })
            .catch((err) => {
                throw new Error(err);
            });
        } else {
            this.socket.emit('newUser', {
                id: this.socket.id,
                name,
                email,
                connected: true
            }, (room) => {
                this.props.dispatch(chatActions.chatNewUser({
                    room,
                    name,
                    email,
                    registered: true
                }));
            });
        }
    }

    typingDelay() {
        return this.typingTimer = setTimeout(() => {
            this.props.dispatch(chatActions.chatIsTyping(false));
        }, 1200);
    }

    onSubmit(e) {
        e.preventDefault();
        const chatInput = e.currentTarget[0].value.trim();
        if (!chatInput) return;
        const message = {
            id: this.props.liveChat.room,
            room: this.props.liveChat.room,
            name: this.props.liveChat.localName,
            message: chatInput,
            date: Date.now()
        };
        this.socket.emit('chatMessage', message);
        this.props.dispatch(chatActions.chatCreateMesssage(''));

        console.log('new message: ', message);
    }

    onChange(e) {
        this.socket.emit('typing', this.props.liveChat.room);
        this.props.dispatch(chatActions.chatOnChange(e.target.value));
    }

    render() {
        return (
            <div>
                <LiveChat
                  onSubmit={this.onSubmit.bind(this)}
                  onChange={this.onChange.bind(this)}
                  newUser={this.newUser.bind(this)}
                  chatOpen={this.props.liveChat.chatOpen}
                  dispatch={this.props.dispatch}
                  {...this.props.liveChat}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        liveChat: state.liveChat
    };
}
function mapDispatchToProps(dispatch) {
    return {
        dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LiveChatContainer);

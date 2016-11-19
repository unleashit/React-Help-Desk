import {
    TOGGLE_CHAT,
    CHAT_CREATE_MESSAGE,
    CHAT_RECEIVE_MESSAGE,
    CHAT_ONCHANGE,
    CHAT_NEW_USER,
    CHAT_ISTYPING,
    CHAT_SET_REMOTE_ID,
    CHAT_SET_SERVER_STATUS,
    CHAT_CONTACT_SENT
} from './helpDeskActions';

export default function liveChat(state = {
    chatOpen: false,
    serverStatus: false,
    room: '',
    localName: '',
    localEmail: '',
    remoteId: '',
    remoteName: '',
    isTyping: false,
    message: '',
    messages: [],
    registered: false,
    contactSent: false
}, action) {
    switch (action.type) {
        case TOGGLE_CHAT:
            return Object.assign({}, state, {
                chatOpen: action.bool,
                contactSent: action.bool ? false : true
            });
        case CHAT_SET_SERVER_STATUS:
            return Object.assign({}, state, {
                serverStatus: action.bool
            });
        case CHAT_SET_REMOTE_ID:
            return Object.assign({}, state, {
                remoteId: action.id,
                remoteName: action.name
            });
        case CHAT_CREATE_MESSAGE:
            return Object.assign({}, state, {
                message: action.message
            });
        case CHAT_RECEIVE_MESSAGE:
            return Object.assign({}, state, {
                messages: state.messages.concat(action.message)
            });
        case CHAT_ONCHANGE:
            return Object.assign({}, state, {
                message: action.message
            });
        case CHAT_NEW_USER:
            return Object.assign({}, state, {
                room: action.user.room,
                localName: action.user.name,
                localEmail: action.user.email,
                registered: action.user.registered
            });
        case CHAT_ISTYPING:
            return Object.assign({}, state, {
                isTyping: action.bool
            });
        case CHAT_CONTACT_SENT:
            return Object.assign({}, state, {
                contactSent: action.bool
            });
        default:
            return state;
    }
}


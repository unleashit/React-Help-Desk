export const TOGGLE_CHAT = 'TOGGLE_CHAT';
export const CHAT_SET_REMOTE_ID = 'CHAT_SET_REMOTE_ID';
export const CHAT_CREATE_MESSAGE = 'CHAT_CREATE_MESSAGE';
export const CHAT_RECEIVE_MESSAGE = 'CHAT_RECEIVE_MESSAGE';
export const CHAT_ONCHANGE = 'CHAT_ONCHANGE';
export const CHAT_NEW_USER = 'CHAT_NEW_USER';
export const CHAT_ISTYPING = 'CHAT_ISTYPING';
export const CHAT_SET_SERVER_STATUS = 'CHAT_SET_SERVER_STATUS';
export const CHAT_CONTACT_SENT = 'CHAT_CONTACT_SENT';

export function toggleChat(bool = true) {
    return (dispatch) => {
        dispatch({ type: TOGGLE_CHAT, bool });
    };
}

export function chatSetServerStatus(bool) {
    return (dispatch) => {
        dispatch({ type: CHAT_SET_SERVER_STATUS, bool });
    };
}

export function chatSetRemoteId(id, name) {
    return (dispatch) => {
        dispatch({ type: CHAT_SET_REMOTE_ID, id, name });
    };
}

export function chatCreateMesssage(message) {
    return (dispatch) => {
        dispatch({ type: CHAT_CREATE_MESSAGE, message });
    };
}

export function chatReceiveMesssage(message) {
    return (dispatch) => {
        dispatch({ type: CHAT_RECEIVE_MESSAGE, message });
    };
}

export function chatOnChange(message) {
    return (dispatch) => {
        dispatch({ type: CHAT_ONCHANGE, message });
    };
}

export function chatNewUser(user) {
    return (dispatch) => {
        dispatch({ type: CHAT_NEW_USER, user });
    };
}

export function chatIsTyping(bool) {
    return (dispatch) => {
        dispatch({ type: CHAT_ISTYPING, bool });
    };
}

export function contactSent(bool) {
    return (dispatch) => {
        dispatch({ type: CHAT_CONTACT_SENT, bool });
    };
}


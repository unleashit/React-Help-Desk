import moment from 'moment';
import { state as props } from './admin';

import removeIcon from './images/minus-circle.svg';
import trashIcon from './images/trash.svg';

export function renderUserList() {
    let {users, connected, messages, currentUser, name} = props;

    return Object.keys(users).length ?
        `<ul class="user-list">${Object.keys(users).map((u) => {
            const connected = users[u].connected ? 'connected' : 'disconnected';
            const active = users[u].id === currentUser ? 'active' : '';
            return `<li class="list-group-item ${connected} ${active}" data-user-id=${users[u].id}>
                        <img src=${removeIcon} data-remove="removeUser" class="remove" />&nbsp;&nbsp;
                        <span>${users[u].name}</span>
                        <span class="tag tag-pill tag-default float-xs-right">
                            ${users[u].messages.length}
                        </span>
                    </li>`;
        }).join('')}</ul>` : 'No current chats.';
}

export function renderMessageList(user, obj) {
    return (typeof obj[user] !== 'undefined') && obj[user].messages.length ?

        // selected user exists and has messages
        `<ul class="message-list">
            <li class="title">${obj[user].name} ${obj[user].email ? ' @ ' + obj[user].email : ''}</li>
            ${obj[user].messages.map(m => `<li class="message-list-message">
                <div class="date float-xs-right">${moment(m.date).fromNow()}</div>
                <div class="name"><strong>${m.name}</strong></div>
                <div>${m.message}</div>
            </li>`).join('')}</ul>` :

            // check to see if there at least is a user
            typeof obj[user] !== 'undefined' ?

                // since the user has no messages, show name/email
                `<ul class="message-list">
                    <li class="title">
                        ${obj[user].name} ${obj[user].email ? ' @ ' + obj[user].email : ''}
                    </li>
                    <li class="message-list-message">No messages in chat.</li>
                </ul>`

                // no user selected
                : ''
}

export function renderArchivedUserList() {
    let {totalUsers, perPage} = props;
    const archived = Object.keys(props.archivedUsers);

    return totalUsers ?
        `<ul class="user-list">
            ${archived.map(u => {
                const active = props.currentUser === u ? 'active' : '';
                return `<li class="archived list-group-item ${active}" data-user-id=${props.archivedUsers[u].id}>
                    <img src=${trashIcon} data-delete="deleteUser" class="trash" />&nbsp;
                    <span>${props.archivedUsers[u].name}</span>
                    <span class="tag tag-pill tag-default float-xs-right">
                        ${props.archivedUsers[u].messages.length}
                    </span>
                </li>`
            }).join('')}
        </ul>
        ${totalUsers > perPage ? renderPagination(archived) : ''}` // add pagination if needed
        : 'No archived chats.';
}

export function renderPagination() {
    const pages = Math.ceil(props.totalUsers / props.perPage);
    let links = '';

    for (let i = 1; i < pages + 1; i++) {
        const active = i - 1 === (props.currentOffset / props.perPage) ? 'active' : '';
        links += `<li class="page-item ${active}"><a class="page-link" href="#">${i}</a></li>`;
    }
    return `
        <nav>
          <ul id="pagination" class="pagination pagination-sm">
            ${links}
          </ul>
        </nav>
     `;
}
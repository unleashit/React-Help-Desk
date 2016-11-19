import React, { Component, PropTypes } from 'react';
import PreReg from './preReg';
import PostReg from './postReg';
import CloseButton from './parts/closeButton';
import * as chatActions from './helpDeskActions';

const cloudIcon = require('./images/cloud.svg');

class LiveChat extends Component {

    render() {
        let showForm = !this.props.registered ?
            <PreReg {...this.props} /> :
            <PostReg {...this.props} />;

        if (this.props.contactSent) {
            showForm = <p>Thank's for your note. I'll soon be in touch.</p>;
        }

        const close = () => {
            this.props.dispatch(chatActions.toggleChat(false));
        };

        const { chatOpen, remoteId } = this.props;

        return (
            <div className={chatOpen ? 'live-chat-wrapper live-chat-open' : 'live-chat-wrapper live-chat-closed'}>
                <div className="inner-wrap">
                    <CloseButton callback={close.bind(this)} />
                    <h3>LIVE CHAT
                        <span className={remoteId ? 'chat-online float-xs-right' : 'chat-offline float-xs-right'}>
                            <span className="cloud-container">
                                <svg className="cloud" viewBox="0 0 30 28">
                                    <path d="M30 18c0 3.313-2.688 6-6 6h-17c-3.859 0-7-3.141-7-7 0-2.797 1.656-5.219 4.031-6.328-0.016-0.219-0.031-0.453-0.031-0.672 0-4.422 3.578-8 8-8 3.344 0 6.203 2.047 7.406 4.969 0.688-0.609 1.594-0.969 2.594-0.969 2.203 0 4 1.797 4 4 0 0.797-0.234 1.531-0.641 2.156 2.656 0.625 4.641 3 4.641 5.844z" />
                                </svg>
                            </span>
                            {remoteId ? 'I\'m online' : 'I\'m offline'}
                        </span>
                    </h3>
                    {showForm}
                </div>
            </div>
        );
    }
}

LiveChat.propTypes = {
    onSubmit: React.PropTypes.func.isRequired,
    message: React.PropTypes.string.isRequired,
    messages: React.PropTypes.array.isRequired,
    registered: React.PropTypes.bool.isRequired
};
LiveChat.defaultProps = {};

export default LiveChat;

import React, { Component, PropTypes } from 'react';
import moment from 'moment';
import { Scrollbars } from 'react-custom-scrollbars';

class PostReg extends Component {

    componentDidMount() {
        this.updateTime = setInterval(() => {
            this.forceUpdate();
        }, 3000);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.messages.length !== this.props.messages.length || this.props.isTyping) {
            this.refs.div.scrollToBottom();
        }
    }

    componentWillUnmount() {
        clearInterval(this.updateTime);
    }

    render() {
        const chatStatus = () => (this.props.remoteId) ?
                `You are chatting with ${this.props.remoteName}` :
                'Feel free to leave a message';

        const isTyping = () => {
            const { isTyping, remoteName } = this.props;
            if (isTyping) {
                return <div className="is-typing animated flash infinite"><strong>{remoteName}</strong> is typing something...</div>;
            }
        };

        return (
            <form className="live-chat-chatting" onSubmit={this.props.onSubmit}>
                <div className="chat-status">{chatStatus()}</div>
                <div className="form-group message-area">
                    <Scrollbars ref="div">
                    <ul className="message-list">
                        {
                            this.props.messages.map((m, i) => (
                                    <li key={i} className="posting">
                                        <div className="name-date-line">
                                            <span className="name">{m.name}</span>&nbsp;
                                            <span className="date">{moment(m.date).fromNow()}</span>
                                        </div>
                                        <div className="message">{m.message}</div>
                                    </li>
                                ))
                        }
                    </ul>
                    {isTyping()}
                    </Scrollbars>
                </div>
                <div className="live-chat-send-group">
                    <div className="form-group">
                        <input
                          type="text" className="form-control"
                          name="message" placeholder="Your message..."
                          value={this.props.message}
                          onChange={this.props.onChange}
                        />
                    </div>
                    <button type="submit" className="button button-green button-smaller button-block">Send</button>
                </div>
            </form>
        );
    }
}

PostReg.propTypes = {
    onChange: React.PropTypes.func.isRequired,
    message: React.PropTypes.string.isRequired,
    messages: React.PropTypes.array.isRequired,
};
PostReg.defaultProps = {};

export default PostReg;

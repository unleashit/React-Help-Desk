import React, { Component } from 'react';
import { connect } from 'react-redux';
import Header from './modules/common/header';
import Home from './modules/home/Home';
import HelpDeskContainer from './modules/reactHelpDesk/HelpDeskContainer';
import HelpDeskLauncher from './modules/reactHelpDesk/launcher';
import { toggleChat } from './modules/reactHelpDesk/helpDeskActions';

require('./style.scss');

class App extends Component {

    closeChat() {
        if (this.props.liveChat.chatOpen) {
            this.props.dispatch(toggleChat(false));
        }
    }

    render() {
        return (
            <div className="page-wrapper">

                <div className={this.props.liveChat.chatOpen ? 'content-wrapper live-chat-open' : 'content-wrapper'}
                     onClick={this.closeChat.bind(this)}>
                    <Header />
                    <Home />
                </div>

                <HelpDeskLauncher />
                <HelpDeskContainer />

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

export default connect(mapStateToProps, mapDispatchToProps)(App);

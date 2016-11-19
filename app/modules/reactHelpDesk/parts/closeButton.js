import React, {
    PropTypes,
} from 'react';

const closeImage = require('../images/close.svg');

const CloseButton = props => (
        <div className="close-button" onClick={props.callback}>
            <img src={closeImage} alt="close" className="close-icon" />
        </div>
    );

export default CloseButton;

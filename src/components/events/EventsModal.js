import React, { Component} from 'react';
import PropTypes from 'prop-types';

class EventsModal extends Component {


    constructor(props) {
        super(props);
    }
    onClose = () => {
        this.props.onClose();
    }

    render() {
        return (
            <div className='modal-wrapper'>
                <div className='modal'>
                    <button className="close" onClick={this.onClose}>&times;</button>
                    <div className=''>{this.props.children}</div>
                </div> 
            </div>
        );
    }
}

export default EventsModal;
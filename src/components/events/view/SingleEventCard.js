import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const SingleEventCard = ({event, pathName, onDelete, rsvp}) => {
    const {name, description, location, orgarniser} = event;
    const eventDate = event.event_date.split('00')[0];
    const url = `/events/${event.id}/edit`;
    const handleDelete = () => {
        onDelete(event.id);
    };
    const handleRsvp = () => {
        rsvp(event.id);
    };
    return (
        <div className='ui card'>
            <div className='content'>
                <div className='header' style={{textTransform: 'capitalize'}}>{name}</div> 
            </div>
            <div className='content'>
                <h4 className="ui sub header">Host : {orgarniser}</h4>
                <div className='meta'>
                    <span>Location : {location}</span> <br/>
                    <span>Date : {eventDate}</span> 
                </div>
                <div className='description'>
                    <p>{description}</p>
                </div>
            </div>
            {pathName === '/events/myEvents' ?
                <div className='extra content'>
                    <div className='ui three buttons'>
                        <button className="ui green basic button">Guests</button>
                        <div className='ui basic teal button'>
                            <Link className='ui' to={url}>Edit </Link>
                        </div>
                        <button onClick={handleDelete} className="ui red basic button">Delete</button>
                    </div>
                </div>
                :
                <div className='extra content' id='rsvp'>
                    <button onClick={handleRsvp} className="ui teal basic button">
                        <i className="calendar plus outline icon" />
                        RSVP
                    </button>
                </div>
            }
        </div>
    );
};


SingleEventCard.propTypes = {
    event : PropTypes.shape({}).isRequired,
    pathName : PropTypes.string.isRequired,
    onDelete : PropTypes.func,
    rsvp : PropTypes.func
};

export default SingleEventCard;

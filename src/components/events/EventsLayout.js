import  React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import  PropTypes from 'prop-types';
import EventsNavBar from './EventsNavBar';
import * as actions from '../../redux/actions/auth';
import {isTokenExpired, getUsername} from '../helpers/helpers';

const EventsLayout = ({component : Component, ...rest}) =>{
    const {page,isAuthenticated,username, logout} = rest;
    return(
        <Route {...rest} render={matchProps => isAuthenticated ? (
            <div >
                <EventsNavBar page={page} username={username} logout={logout}/>
                <div className='ui grid'>
                  <div className="ten wide centered column">
                     <Component  {...matchProps}   />   
                  </div>
                </div>
            </div>
        ): <Redirect to={{ pathname: '/auth/login', state: { from: rest.location } }}/>}/>
    )
};
 
EventsLayout.propTypes = {
    isAuthenticated : PropTypes.bool.isRequired,
    logout : PropTypes.func.isRequired
};

function mapStateToProps(state){
    return{
        isAuthenticated : !!state.user.access_token && !isTokenExpired(state.user.access_token),
        username : getUsername(state.user.access_token)
    }
}
export default connect(mapStateToProps,{logout : actions.logout })(EventsLayout);
/* global describe :true */
/* global it :true */
/* global expect afterEach beforeEach:true */
/* eslint no-undef: "error" */
import moxios from 'moxios';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../../../src/redux/actions/events';
import * as types from '../../../src/redux/actions/types';
import {instance} from '../../../src/api';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('Events Actions', ()=> {
    describe('EVENT_CREATED action creator', ()=> {
        it('should return an event and action type', ()=> {
            const createdEvent = { eventInfo : 'some event information', testing : 'yes we are just testing'};
            const expectedAction = {
                type : types.EVENT_CREATED,
                createdEvent
            };
            expect(actions.eventCreated(createdEvent)).toEqual(expectedAction);
        });
    });
    describe('ALL_EVENTS_FETCHED action creator', ()=> {
        it('should return an action of type ALL_EVENTS_FETCHED and an array of events ', ()=> {
            const events = [{ eventInfo : 'some event information', testing : 'yes we are just testing'}];
            const expectedAction = {
                type : types.ALL_EVENTS_FETCHED,
                events 
            };
            expect(actions.eventsFetched(events)).toEqual(expectedAction);
        });
    });
    describe('MY_EVENTS_FETCHED action creator', ()=> {
        it('should return an action of type MY_EVENTS_FETCHED and an array of events', ()=> {
            const events = [{ eventInfo : 'some event information', testing : 'yes we are just testing'}];
            const expectedAction = {
                type : types.MY_EVENTS_FETCHED,
                events 
            };
            expect(actions.myEventsFetched(events)).toEqual(expectedAction);
        });
    });
    describe('EVENT_UPDATED action creator', ()=> {
        it('should return an action of type EVENT_UPDATED and the updated event', ()=> {
            const updatedEvent = { eventInfo : 'some event information', testing : 'yes we are just testing'};
            const expectedAction = {
                type : types.EVENT_UPDATED,
                updatedEvent 
            };
            expect(actions.eventUpdated(updatedEvent)).toEqual(expectedAction);
        });
    });
    describe('EVENT_DELETED action creator', ()=> {
        it('should return an action of type EVENT_DELETED and the deleted event Id', ()=> {
            const eventId = 2;
            const expectedAction = {
                type : types.EVENT_DELETED,
                eventId
            };
            expect(actions.eventDeleted(eventId)).toEqual(expectedAction);
        });
    });
    describe('Async actions', ()=> {
        beforeEach(()=> {
            moxios.install(instance);
        });
        afterEach(()=> {
            moxios.uninstall(instance);
        });
        describe('ALL_EVENTS_FETCHED action', ()=> {
            it('should dispacth ALL_EVENTS_FETCHED on success', ()=> {
                const data = { event_list : [{name: 'all events'}]};
                moxios.wait(()=> {
                    const request = moxios.requests.mostRecent();
                    request.respondWith({
                        status : 200,
                        response : data
                    });
                });
                const expectedAction = [{type: types.ALL_EVENTS_FETCHED, events: [{name: 'all events'}]}]; 
                const store = mockStore({ events: [] });
                return store.dispatch(actions.fetchEvents()).then(()=> {
                    expect(store.getActions()).toEqual(expectedAction);
                });
            });
        });
        describe('MY_EVENTS_FETCHED action', ()=> {
            it('should dispatch MY_EVENTS_FETCHED on success', ()=> {
                const data = {event_list: [{name: 'my event'}]};
                moxios.wait(()=> {
                    const request = moxios.requests.mostRecent();
                    request.respondWith({
                        status : 200,
                        response : data
                    });
                });
                const expectedAction = [{type: types.MY_EVENTS_FETCHED, events: [{name: 'my event'}]}]; 
                const store = mockStore({ events: [] });
                return store.dispatch(actions.fetchMyEvents()).then(()=> {
                    expect(store.getActions()).toEqual(expectedAction);
                });
            });
        });
        describe('EVENT_CREATED action', ()=> {
            it('should dispatch EVENT_CREATED on success', ()=> {
                const createdEvent = {name: 'new event'};
                moxios.wait(()=> {
                    const request = moxios.requests.mostRecent();
                    request.respondWith({
                        status : 201,
                        response : createdEvent
                    });
                });
                const expectedAction = [{type: types.EVENT_CREATED, createdEvent: {name: 'new event'}}]; 
                const store = mockStore({ events: [] });
                return store.dispatch(actions.create()).then(()=> {
                    expect(store.getActions()).toEqual(expectedAction);
                });
            });
        });
    });
});

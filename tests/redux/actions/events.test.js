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
        describe('EVENT_UPDATED action', ()=> {
            it('should dispatch EVENT_UPDATED on success', ()=> {
                const data  = {event: {id : 1, name: 'updated event'}};
                const initialState = [{id : 1, name: 'new event'}, {id : 2, name: 'old event'}];
                moxios.wait(()=> {
                    const request = moxios.requests.mostRecent();
                    request.respondWith({
                        status : 201,
                        response : data
                    });
                });
                const expectedAction = [{type: types.EVENT_UPDATED, updatedEvent: { id : 1, name: 'updated event'}},
                    {modalState: {open: false}, type: 'CLOSE_MODAL'}]; 
                const store = mockStore({ events: initialState});
                return store.dispatch(actions.updateEvent(data.event, 1)).then(()=> {
                    expect(store.getActions()).toEqual(expectedAction);
                });
            });
        });
        describe('EVENT_DELETED action', ()=> {
            it('should dispatch EVENT_DELETED on success', ()=> {
                const message = 'event deleted';
                const initialState = [{id : 1, name: 'new event'}, {id : 2, name: 'old event'}];
                moxios.wait(()=> {
                    const request = moxios.requests.mostRecent();
                    request.respondWith({
                        status : 200,
                        response : message
                    });
                });
                const expectedAction = [{type: types.EVENT_DELETED },
                    {'modalState': {'open': false}, 'type': 'CLOSE_MODAL'},
                    {message: {text: 'event deleted', type: 'success'}, type: 'ADD_FLASH_MEASSAGE'}]; 
                const store = mockStore({ events: initialState});
                return store.dispatch(actions.onDelete(1)).then(()=> {
                    expect(store.getActions().length).toEqual(expectedAction.length);
                });
            });
        });
        describe('RSVP action', ()=> {
            it('should dispatch EVENT_UPDATED and ADD_FLASH_MEASSAGE on success', ()=> {
                const initialState = [{id : 1, name: 'my event', rsvp_list: []}];
                const data  = {event: {id : 1, name: 'my event', rsvp_list: ['guest1']},
                    message: 'rsvp success'
                };
                moxios.wait(()=> {
                    const request = moxios.requests.mostRecent();
                    request.respondWith({
                        status : 200,
                        response : data
                    });
                });
                const expectedAction = [
                    {'type': 'EVENT_UPDATED', 'updatedEvent': {'id': 1, 'name': 'my event', 'rsvp_list': ['guest1']}},
                    {'message': {'text': 'rsvp success', 'type': 'success'}, 'type': 'ADD_FLASH_MEASSAGE'}
                ];
                const store = mockStore({ events: initialState});
                return store.dispatch(actions.rsvp(1)).then(()=> {
                    expect(store.getActions()).toEqual(expectedAction);
                });
            });
        });
        describe('Delete RSVP  action', ()=> {
            it('should dispatch EVENT_UPDATED and ADD_FLASH_MEASSAGE on success', ()=> {
                const initialState = [{id : 1, name: 'my event', rsvp_list: ['guest1']}];
                const data  = {event: {id : 1, name: 'my event', rsvp_list: []},
                    message: 'rsvp removal success'
                };
                moxios.wait(()=> {
                    const request = moxios.requests.mostRecent();
                    request.respondWith({
                        status : 200,
                        response : data
                    });
                });
                const expectedAction = [
                    {'type': 'EVENT_UPDATED', 'updatedEvent': {'id': 1, 'name': 'my event', 'rsvp_list': []}},
                    {'message': {'text': 'rsvp removal success', 'type': 'success'}, 'type': 'ADD_FLASH_MEASSAGE'}
                ];
                const store = mockStore({ events: initialState});
                return store.dispatch(actions.deleteRsvp(1)).then(()=> {
                    expect(store.getActions()).toEqual(expectedAction);
                });
            });
        });
    });
});

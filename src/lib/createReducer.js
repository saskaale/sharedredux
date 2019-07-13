import { compare } from 'fast-json-patch';
import { apply_patch } from 'jsonpatch';
import Connector from './connector';
import createActions from './createActions';
import {shallowCompare} from './utils';

const defaultStatus = {
    connected: false
};

const DEBUG = true;

const createReducer = (fun, dispatch, connectionParams, connectionSeed, {
    shouldSendAction = () => false,
    ACTION_PREFIX = "@SYNCX_", 
    STATUS_KEY = '_'
} = {}) => {
    const {
        ActionTypes, 
        updateStatus, 
        serverReplaceState, 
        serverChangeState 
    } = createActions(ACTION_PREFIX, dispatch);

        let connection;
        const log = (...msg) => {
            if(DEBUG)
                console.log(...msg);
        }

        const getObjOrFun = (data, state) => 
                typeof data === 'function' ? data(state) : data;


        const getConnectionParamsObject = getObjOrFun.bind(null, connectionParams);
        const getConnectionSeedObject   = getObjOrFun.bind(null, connectionSeed);

        let curConnectionParamsObject, curConnectionSeedObject, storeInitialized = false;

        const reconnect = (state) => {
            storeInitialized = true;

            curConnectionParamsObject = getConnectionParamsObject(state);
            curConnectionSeedObject = getConnectionSeedObject(state);

            console.log('recreate Connection', curConnectionParamsObject, curConnectionSeedObject);

            if( connection ){
                log("remove old Connection");
                updateStatus({connected: false});
                connection._socket.disconnect();
            }

            connection = new Connector(
                            curConnectionParamsObject,
                            curConnectionSeedObject,
                            updateStatus
                        );

            connection._socket.on('replace', (data) => {
                log("RECV replace", data);
                serverReplaceState(data.data)
            });
    
            connection._socket.on('change', (data) => {
                log("RECV change", data);
                serverChangeState(data.diff)
            });
        }

        const requestReplace = () => {
            log("EMIT requestReplace");
            if(connection)
                connection._socket.emit('requestReplace');
        }

        const reducerSubscriber = (state, oldstate, action) => {
            const diff = compare(oldstate, state);

            const data = { diff, action }
            if(connection)
                connection._socket.emit('change', data);
        }

        const reducer = (state, action) => {
            const ret = fun(state, action);

            const sendAction = shouldSendAction(action);
            if(state && ( ret !== state || shouldSendAction(action) )){
                reducerSubscriber(
                    ret, 
                    state || {}, 
                    sendAction ? action : undefined
                );
            }

            if(!ret[STATUS_KEY])
                ret[STATUS_KEY] = defaultStatus;

            switch(action.type){
                case ActionTypes.STATUS_CHANGE:
                    return {[STATUS_KEY]: {
                        ...state[STATUS_KEY], ...action.payload
                    }, ...state};
                case ActionTypes.SERVER_CHANGE:
                    let newstate = state;
                    try{
                        newstate = apply_patch(state, action.payload);
                    }catch(e){
                        requestReplace();
                    }
                    return newstate;
                case ActionTypes.SERVER_REPLACE:
                    return action.payload;
                default:
                    return ret;
            }
        };




        const storeSubscriber = (state) => {
            if(!storeInitialized){
                reconnect(state);
                return;
            }
            const connParams = getConnectionParamsObject(state);
            const connSeed = getConnectionSeedObject(state);
            if(shallowCompare(connParams, curConnectionParamsObject) || 
                    shallowCompare(connSeed, curConnectionSeedObject)
                ){
                reconnect(state);
                return;
            }
        }

        const addSubscriber = (store) => {
            const action = () => storeSubscriber(store.getState());

            action();
            store.subscribe(action);
        }

        return {
            addSubscriber,
            reconnect,
            reducer
        }
}

export default createReducer;
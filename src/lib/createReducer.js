import { compare } from 'fast-json-patch';
import { apply_patch } from 'jsonpatch';
import Connector from './connector';
import createActions from './createActions';

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
                data === 'function' ? data(state) : data;


        const getConnectionParamsObject = getObjOrFun.bind(null, connectionParams);
        const getConnectionSeedObject   = getObjOrFun.bind(null, connectionSeed);

        const reconnect = (state) => {
            console.log('recreate Connection');
            if( connection ){
                updateStatus({connected: false});
                connection._socket.disconnect();
            }

            

            connection = new Connector(
                            getConnectionParamsObject(state),
                            getConnectionSeedObject(state),
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

/*        const setConnectionParams = (params) => {
            //TODO: do better object comparsion
            const objCompare = (a, b) => JSON.stringify(a) === JSON.stringify(b);

            if(!objCompare(curConnectionParams, params)){
                curConnectionParams = params;
                reconnect();
            }
        }
*/
        reconnect();

        const requestReplace = () => {
            log("EMIT requestReplace");
            if(connection)
                connection._socket.emit('requestReplace');
        }


        const subscriber = (state, oldstate, action) => {
            const diff = compare(oldstate, state);

            const data = { diff, action }
            if(connection)
                connection._socket.emit('change', data);
        }
        


        const reducer = (state, action) => {
            const ret = fun(state, action);

            const sendAction = shouldSendAction(action);
            if(state && ( ret !== state || shouldSendAction(action) )){
                subscriber(
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

        return {
            reconnect,
            reducer
        }
}

export default createReducer;
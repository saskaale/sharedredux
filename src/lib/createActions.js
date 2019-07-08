const createActions = (ACTION_PREFIX, dispatch) => {
    const ActionTypes = {
        STATUS_CHANGE: `${ACTION_PREFIX}_STATUS_CHANGE`,
        SERVER_REPLACE: `${ACTION_PREFIX}_SERVER_REPLACE`,
        SERVER_CHANGE: `${ACTION_PREFIX}_SERVER_CHANGE`,
    };

    const updateStatus = (s) => dispatch({
        type: ActionTypes.STATUS_CHANGE, 
        payload: s
    });

    const serverReplaceState = (s) => dispatch({
        type: ActionTypes.SERVER_REPLACE, 
        payload: s
    });

    const serverChangeState = (s) => dispatch({
        type: ActionTypes.SERVER_CHANGE, 
        payload: s
    });


    return {
        ActionTypes, 
        updateStatus, 
        serverReplaceState, 
        serverChangeState
    };
}

export default createActions;